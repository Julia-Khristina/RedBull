# Diagramas de sequência UML - Seção 3.2.4

Este documento reúne o código-fonte em PlantUML dos dois diagramas de sequência usados na seção 3.2.4 do WAD, correspondentes aos arquivos `assets/programacao/diagrama-sequencia-uml-1.svg` e `assets/programacao/diagrama-sequencia-uml-2.svg`. O primeiro descreve o fluxo de registro de checkpoint via OCR, e o segundo descreve o cadastro de equipe com geração e uso de UUID público.

Os diagramas modelam a comunicação entre as camadas da arquitetura da aplicação seguindo o fluxo Controller → Service → Repository → Banco de Dados. As chamadas síncronas usam `->`, os processamentos assíncronos usam `->>` e os retornos tracejados usam `-->`.

Fluxo 1:

```puml
@startuml

title Fluxo 1: registro de checkpoint via OCR

actor Operador
participant Controller
participant Service
participant Repository
database Banco

== Fase 1: captura da imagem ==

Operador -> Controller : POST /ocr/extractions
Controller -> Service : ocr.extract(image)
Service -> Repository : extraction.create(status=PENDING)
Repository -> Banco : INSERT ocr_extractions
Banco --> Repository : id e status inicial
Repository --> Service : OcrExtractionEntity
Service ->> Service : processa OCR assíncrono
Service --> Controller : job de OCR iniciado
Controller --> Operador : 202 Accepted com id da extração

== Fase 2: validação humana ==

Operador -> Controller : PATCH /ocr/extractions/:id
Controller -> Service : validateData(data)
Service -> Service : verifica inconsistências

alt dados inconsistentes
  Service --> Controller : alerta com desvio
  Controller --> Operador : 200 OK com alerta
else dados OK
  Service --> Controller : tudo certo
  Controller --> Operador : 200 OK dados validados
end

== Fase 3: salvar checkpoint ==

Operador -> Controller : POST /checkpoints
Controller -> Service : saveCheckpoint()
Service -> Repository : checkpoint.create()
Repository -> Banco : INSERT checkpoints
Banco --> Repository : id e data de criação
Repository --> Service : CheckpointEntity
Service -> Service : registra log de auditoria
Service --> Controller : checkpoint salvo
Controller --> Operador : 201 Created

@enduml
```

Fluxo 2:

```puml
@startuml

title Fluxo 2: cadastro de equipe e geração de UUID

actor Admin
participant Controller
participant Service
participant Repository
database Banco

== Fase 1: cadastro da equipe ==

Admin -> Controller : POST /competitions/:id/teams
Controller -> Service : validateInput(body)
Service -> Service : gera UUID único
Service -> Service : monta entidade da equipe
Service -> Repository : team.create(entidade)
Repository -> Banco : INSERT teams
Banco --> Repository : id e data de criação

== Fase 2: cadastro dos atletas ==

loop para cada atleta
  Repository -> Banco : INSERT athletes
  Banco --> Repository : id do atleta
end

Repository --> Service : equipe com atletas
Service -> Service : gera link público com UUID
Service ->> Service : atualiza ranking em background
Service --> Controller : equipe e link público
Controller --> Admin : 201 Created com link

== Fase 3: cópia do link ==

Admin -> Controller : GET /teams/:id
Controller -> Service : getTeamWithLink()
Service -> Repository : team.findById(id)
Repository -> Banco : SELECT team, athletes
Banco --> Repository : dados da equipe
Repository --> Service : TeamEntity com atletas
Service --> Controller : uuid e link público
Controller --> Admin : 200 OK com link para copiar

@enduml
```
.