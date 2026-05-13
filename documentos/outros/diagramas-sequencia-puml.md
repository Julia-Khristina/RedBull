# Diagramas de sequência UML - Seção 3.2.4

Este documento reúne o código-fonte em PlantUML dos dois diagramas de sequência usados na seção 3.2.4 do WAD, correspondentes aos arquivos `assets/programacao/diagrama-sequencia-uml-1.svg` e `assets/programacao/diagrama-sequencia-uml-2.svg`. O primeiro descreve o fluxo de registro de checkpoint via OCR, e o segundo descreve o cadastro de equipe com geração e uso de UUID público.

Fluxo 1:

```puml
@startuml

title Fluxo 1: registro de checkpoint via OCR

actor Juiz
participant Controller
participant Service
participant Repository
database Banco

== Fase 1: captura da imagem ==

Juiz -> Controller : POST /ocr/extractions
Controller -> Service : ocr.extract(image)
Service -> Service : chama API de OCR
Service --> Controller : retorna km, pace e tempo
Controller --> Juiz : 200 OK com prévia dos dados

== Fase 2: validação humana ==

Juiz -> Controller : PATCH /ocr/extractions/:id
Controller -> Service : validateData(data)
Service -> Service : verifica inconsistências

alt dados inconsistentes
  Service --> Controller : alerta com desvio
  Controller --> Juiz : 200 OK com alerta
else dados OK
  Service --> Controller : tudo certo
  Controller --> Juiz : 200 OK dados validados
end

== Fase 3: salvar checkpoint ==

Juiz -> Controller : POST /checkpoints
Controller -> Service : saveCheckpoint()
Service -> Repository : checkpoint.create()
Repository -> Banco : INSERT checkpoints
Banco --> Repository : id e data de criação
Repository --> Service : CheckpointEntity
Service -> Service : registra log de auditoria
Service --> Controller : checkpoint salvo
Controller --> Juiz : 201 Created

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
Service --> Controller : equipe e link público
Controller --> Admin : 201 Created com link

== Fase 3: cópia do link ==

Admin -> Controller : GET /teams/:id
Controller -> Service : getTeamWithLink()
Service --> Controller : uuid e link público
Controller --> Admin : 200 OK com link para copiar

@enduml
```
