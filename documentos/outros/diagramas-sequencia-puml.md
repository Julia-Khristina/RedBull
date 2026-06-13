# Diagramas de sequência UML - Seção 3.2.4

Este documento reúne o código-fonte em PlantUML dos diagramas de sequência usados na seção 3.2.4 do WAD. Os Fluxos 1 e 2 foram elaborados na Sprint 3; os Fluxos 3 e 4 foram mapeados na Sprint 4 com base no código implementado, após padronização das nomenclaturas de camadas para o inglês.

Os diagramas modelam a comunicação entre as camadas da arquitetura da aplicação seguindo o fluxo Controller → Service → Repository → Banco de Dados. As chamadas síncronas usam `->`, os processamentos assíncronos usam `->>` e os retornos tracejados usam `-->`.

Fluxo 1:

```puml
@startuml

title Fluxo 1: registro de checkpoint via OCR

actor Operador
participant checkpointController
participant checkpointService
participant checkpointRepository
database Banco

== Fase 1: captura da imagem ==

Operador -> checkpointController : POST /ocr/extractions
checkpointController -> checkpointService : ocr.extract(image)
checkpointService -> checkpointRepository : extraction.create(status=PENDING)
checkpointRepository -> Banco : INSERT ocr_extractions
Banco --> checkpointRepository : id e status inicial
checkpointRepository --> checkpointService : OcrExtractionEntity
checkpointService ->> checkpointService : processa OCR assíncrono
checkpointService --> checkpointController : job de OCR iniciado
checkpointController --> Operador : 202 Accepted com id da extração

== Fase 2: validação humana ==

Operador -> checkpointController : PATCH /ocr/extractions/:id
checkpointController -> checkpointService : validateData(data)
checkpointService -> checkpointService : verifica inconsistências

alt dados inconsistentes
checkpointService --> checkpointController : alerta com desvio
checkpointController --> Operador : 200 OK com alerta
else dados OK
checkpointService --> checkpointController : tudo certo
checkpointController --> Operador : 200 OK dados validados
end

== Fase 3: salvar checkpoint ==

Operador -> checkpointController : POST /checkpoints
checkpointController -> checkpointService : saveCheckpoint()
checkpointService -> checkpointRepository : checkpoint.create()
checkpointRepository -> Banco : INSERT checkpoints
Banco --> checkpointRepository : id e data de criação
checkpointRepository --> checkpointService : CheckpointEntity
checkpointService -> checkpointService : registra log de auditoria
checkpointService --> checkpointController : checkpoint salvo
checkpointController --> Operador : 201 Created

@enduml
```

Fluxo 2:

```puml
@startuml

title Fluxo 2: cadastro de equipe e geração de UUID

actor Admin
participant teamController
participant teamService
participant teamRepository
database Banco

== Fase 1: cadastro da equipe ==

Admin -> teamController : POST /competitions/:id/teams
teamController -> teamService : validateInput(body)
teamService -> teamService : gera UUID único
teamService -> teamService : monta entidade da equipe
teamService -> teamRepository : team.create(entidade)
teamRepository -> Banco : INSERT teams
Banco --> teamRepository : id e data de criação

== Fase 2: cadastro dos atletas ==

loop para cada atleta
teamRepository -> Banco : INSERT athletes
Banco --> teamRepository : id do atleta
end

teamRepository --> teamService : equipe com atletas
teamService -> teamService : gera link público com UUID
teamService ->> teamService : atualiza ranking em background
teamService --> teamController : equipe e link público
teamController --> Admin : 201 Created com link

== Fase 3: cópia do link ==

Admin -> teamController : GET /teams/:id
teamController -> teamService : getTeamWithLink()
teamService -> teamRepository : team.findById(id)
teamRepository -> Banco : SELECT team, athletes
Banco --> teamRepository : dados da equipe
teamRepository --> teamService : TeamEntity com atletas
teamService --> teamController : uuid e link público
teamController --> Admin : 200 OK com link para copiar

@enduml
```

Fluxo 3:

```puml
@startuml

title Fluxo 3: autenticação de administrador (Sprint 4)

actor Admin
participant authController
participant authService
participant adminRepository
database Banco

Admin -> authController : POST /auth/sessions\n{ email, password }
authController -> authService : createSession(body)
authService -> adminRepository : findByEmail(email)
adminRepository -> Banco : SELECT * FROM admin WHERE email = ?
Banco --> adminRepository : Admin | null

alt admin não encontrado ou senha inválida
adminRepository --> authService : null
authService --> authController : UnauthorizedError
authController --> Admin : 401 Unauthorized
else credenciais válidas
adminRepository --> authService : AdminEntity
authService -> authService : compara password com ADMIN_PASSWORD
authService -> authService : generateToken(admin) → JWT HS256 8h
authService --> authController : { access_token, refresh_token, admin }
authController --> Admin : 200 OK com token JWT
end

@enduml
```

Fluxo 4:

```puml
@startuml

title Fluxo 4: criação de checkpoint (Sprint 4)

actor Operador
participant checkpointController
participant checkpointService
participant checkpointRepository
database Banco

Operador -> checkpointController : POST /checkpoints\n{ identifier, distance_km, id_runner, id_competition, id_treadmill, id_admin }
checkpointController -> checkpointService : create(req.body)
checkpointService -> checkpointService : validateCreateCheckpoint(payload)

alt payload inválido
checkpointService --> checkpointController : ValidationError
checkpointController --> Operador : 400 Bad Request
else payload válido
checkpointService -> checkpointRepository : create(input)
checkpointRepository -> Banco : INSERT INTO checkpoint ...
Banco --> checkpointRepository : registro criado

alt erro 23505 (unique violation)
checkpointRepository --> checkpointService : PgError code=23505
checkpointService --> checkpointController : ConflictError
checkpointController --> Operador : 409 Conflict
else erro 23503 (fk violation)
checkpointRepository --> checkpointService : PgError code=23503
checkpointService --> checkpointController : NotFoundError
checkpointController --> Operador : 404 Not Found
else sucesso
checkpointRepository --> checkpointService : CheckpointEntity
checkpointService --> checkpointController : checkpoint criado
checkpointController --> Operador : 201 Created
end
end

@enduml
```
