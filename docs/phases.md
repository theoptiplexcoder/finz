# Phase-by-Phase Implementation Plan: Universal Spreadsheet Intelligence Agent

I recommend building this in **12 phases**, moving from a working spreadsheet assistant to a persistent, multi-tenant, voice-enabled agent platform.

The key is to avoid building the entire infrastructure before validating the agent's ability to solve real spreadsheet problems.

Your first milestone should be:

> A user uploads an Excel workbook, asks a question in natural language, receives an analysis, reviews proposed modifications, approves them, and sees the updated spreadsheet directly in the browser.

Everything else builds on this foundation.

---

# Overall roadmap

| Phase | Focus | Estimated duration |
|---|---|---:|
| 0 | Requirements and architecture | 3 days |
| 1 | Project foundation | 4 days |
| 2 | Spreadsheet interface | 5 days |
| 3 | Spreadsheet processing engine | 7 days |
| 4 | Agent runtime and tools | 7 days |
| 5 | Planning, execution and verification | 7 days |
| 6 | Memory and domain skills | 5 days |
| 7 | Agent observability | 3 days |
| 8 | Google Sheets integration | 5 days |
| 9 | Windows Excel integration | 7 days |
| 10 | Voice interaction | 5 days |
| 11 | Multi-tenancy and security | 7 days |
| 12 | Testing, deployment and optimisation | 7 days |

**Estimated total: 72 development days.**

These are planning estimates for one developer, not fixed deadlines. Some phases can overlap.

---

# Phase 0: Requirements and architecture

**Duration: 3 days**

Before writing code, establish the boundaries between your components.

### 0.1 Define the core architecture

I recommend this architecture:

```text
                   Next.js Frontend
                          |
                 Chat + Voice + Sheets
                          |
                     FastAPI
                          |
                  Agent Runtime
                   Pydantic AI
                          |
                 Workflow Engine
                 Custom State Machine
                          |
             +------------+------------+
             |            |            |
          Tool Layer   Skill Layer   Memory
             |            |            |
       Spreadsheet     Domain       PostgreSQL
       Browser         Knowledge    Qdrant*
       Database
       Reporting
             |
         Connectors
             |
       +-----+------+
       |            |
   Local Excel   Google Sheets
       |
   Windows Companion
```

*Qdrant is optional. Don't introduce it until you have a genuine semantic retrieval requirement.*

### 0.2 Define the interfaces

Decide how components communicate.

For example:

**Agent tool interface:**

```python
class ToolResult:
    success: bool
    data: dict
    error: str | None
    execution_id: str
```

**Spreadsheet connector interface:**

```python
class SpreadsheetConnector:

    async def list_workbooks(self):
        pass

    async def get_workbook_metadata(self, workbook_id):
        pass

    async def read_range(self, workbook_id, sheet, range):
        pass

    async def write_range(self, workbook_id, sheet, range, values):
        pass

    async def create_sheet(self, workbook_id, name):
        pass
```

All spreadsheet providers should implement the same interface.

### Deliverable

- Architecture document.
- Database entity design.
- API contracts.
- Agent state diagram.
- Connector interface specification.

---

# Phase 1: Project foundation

**Duration: 4 days**

Establish the development environment.

### Technology choices

| Component | Technology |
|---|---|
| Frontend | Next.js + TypeScript |
| Backend | FastAPI |
| Agent framework | Pydantic AI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Authentication | Supabase Auth |
| Package management | pnpm + uv |
| Model gateway | LiteLLM |

### Suggested repository structure

```text
spreadsheet-agent/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   └── lib/
│   │
│   └── desktop/
│       └── tauri/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── agent/
│   │   ├── tools/
│   │   ├── connectors/
│   │   ├── skills/
│   │   ├── memory/
│   │   ├── security/
│   │   ├── database/
│   │   └── observability/
│   │
│   └── tests/
│
├── docker/
├── docs/
└── README.md
```

### Implementation tasks

1. Initialise Next.js.
2. Initialise FastAPI.
3. Configure PostgreSQL.
4. Configure migrations.
5. Implement authentication.
6. Establish frontend-backend communication.
7. Add environment configuration.

### Completion criteria

You should be able to register, log in, create a workspace and communicate with the backend.

---

# Phase 2: Spreadsheet interface

**Duration: 5 days**

This is the primary interface through which users interact with their data.

### Technology

Use [Univer](https://docs.univer.ai/).

It provides spreadsheet functionality that you can embed into your Next.js application.

### Build these components

```text
Dashboard
│
├── Sidebar
│   ├── Workspaces
│   ├── Workbooks
│   ├── Skills
│   └── Settings
│
└── Workspace
    │
    ├── Workbook Header
    │
    ├── Spreadsheet Editor
    │
    ├── AI Assistant Panel
    │   ├── Chat
    │   ├── Suggestions
    │   └── Execution Status
    │
    └── Approval Panel
```

### Required functionality

- Upload XLSX files.
- Display multiple sheets.
- Navigate between sheets.
- Select cells and ranges.
- Edit cells manually.
- Save changes.
- Download modified workbook.
- Display formulas.
- Display agent-generated modifications.

### Important design decision

The AI assistant must understand the currently selected cell or range.

For example:

User selects `B2:B50` and asks:

"Calculate the average."

The frontend should provide the agent with:

```json
{
  "workbook_id": "wb_123",
  "sheet": "Sales",
  "selection": "B2:B50"
}
```

This provides context without requiring the agent to rediscover everything.

### Completion criteria

A user can upload, edit and export a workbook without using the AI assistant.

---

# Phase 3: Spreadsheet processing engine

**Duration: 7 days**

This is one of the most important phases.

Do not allow the LLM to manipulate spreadsheets directly.

Build a deterministic spreadsheet processing engine.

### Technology

- OpenPyXL
- Pandas
- Polars
- DuckDB
- LibreOffice

### Implement five modules

**1. Workbook Inspector**

```python
inspect_workbook()
list_sheets()
get_sheet_dimensions()
get_column_names()
get_cell_values()
get_formulas()
get_named_ranges()
get_tables()
```

**2. Data Analysis**

```python
calculate_statistics()
group_by()
aggregate()
calculate_growth()
calculate_profit_margin()
detect_outliers()
detect_duplicates()
```

**3. Data Cleaning**

```python
remove_duplicates()
normalize_dates()
normalize_currency()
handle_missing_values()
standardize_categories()
```

**4. Formula Engine**

```python
generate_formula()
explain_formula()
validate_formula()
find_broken_references()
```

Remember that OpenPyXL does not calculate Excel formulas. You need a separate recalculation mechanism, such as LibreOffice, when formula evaluation is required.

**5. Workbook Modification**

```python
write_cells()
insert_rows()
delete_rows()
format_cells()
create_sheet()
create_chart()
create_table()
```

### Completion criteria

Every operation must work independently of the LLM.

Test these functions using synthetic datasets.

For example, create a kirana store workbook containing:

- 500 products.
- 12 months of sales.
- Purchase prices.
- Selling prices.
- Inventory levels.
- Supplier information.

Your processing engine should be able to calculate revenue, gross profit, inventory turnover and slow-moving products.

---

# Phase 4: Agent runtime and tool registry

**Duration: 7 days**

Now introduce intelligence.

Use Pydantic AI for agent execution and typed tools.

### 4.1 Build the agent

Start with one agent:

```text
SpreadsheetAgent
│
├── System Instructions
├── Model Router
├── Context Manager
├── Tool Registry
├── Skill Registry
└── Execution Controller
```

### 4.2 Register tools

Start with these tools:

| Tool | Function |
|---|---|
| `inspect_workbook` | Understand workbook structure |
| `inspect_sheet` | Understand individual sheets |
| `read_range` | Read cell ranges |
| `analyse_data` | Perform statistical analysis |
| `clean_data` | Clean datasets |
| `generate_formula` | Generate formulas |
| `modify_workbook` | Modify cells and sheets |
| `create_chart` | Generate charts |
| `generate_report` | Generate reports |

Keep each tool narrowly scoped.

### 4.3 Build a model router

Use LiteLLM to support:

- OpenRouter.
- Ollama.
- Other compatible model providers.

Make the model configurable per tenant.

### 4.4 Implement the conversation API

Example:

```http
POST /api/agent/chat
```

Request:

```json
{
  "conversation_id": "conv_123",
  "workbook_id": "wb_123",
  "message": "Analyse my sales performance"
}
```

Response:

```json
{
  "run_id": "run_123",
  "status": "running"
}
```

Use Server-Sent Events or WebSockets to stream execution updates.

### Completion criteria

The agent can inspect a workbook, select appropriate tools, execute an analysis and explain the results.

---

# Phase 5: Planning, execution and verification

**Duration: 7 days**

This is where your project starts becoming an actual agent rather than a chatbot with spreadsheet tools.

Implement a controlled execution state machine.

### Agent states

```text
IDLE
  |
  v
UNDERSTANDING
  |
  v
INSPECTING
  |
  v
PLANNING
  |
  v
APPROVAL_REQUIRED
  |
  v
EXECUTING
  |
  v
VERIFYING
  |
  v
COMPLETED
```

Failure paths:

```text
EXECUTING
    |
    v
FAILED
    |
    v
RETRY / RECOVERY
```

### Example task

User:

"Increase the selling price of products whose gross margin is below 10% by 5%."

Agent workflow:

1. Inspect workbook.
2. Identify selling price and purchase price columns.
3. Calculate gross margins.
4. Identify products below 10%.
5. Generate proposed modifications.
6. Show the user a preview.
7. Request approval.
8. Apply modifications.
9. Read back updated values.
10. Verify results.
11. Return a summary.

### Introduce change sets

Never directly overwrite data without maintaining a reversible record.

Example:

```json
{
  "operation": "update_cells",
  "changes": [
    {
      "cell": "D12",
      "old_value": 100,
      "new_value": 105
    },
    {
      "cell": "D18",
      "old_value": 200,
      "new_value": 210
    }
  ]
}
```

Store the change set and its approval status.

Implement:

- Preview.
- Approve.
- Reject.
- Apply.
- Verify.
- Undo.

### Completion criteria

The agent can safely modify a workbook, verify the results and reverse an operation.

---

# Phase 6: Memory and domain skills

**Duration: 5 days**

This is how you make the agent useful across industries.

Avoid building separate agents for every industry.

Build a skill system.

### 6.1 Skill directory

```text
skills/
│
├── general/
│   ├── spreadsheet-expert/
│   ├── data-cleaning/
│   ├── statistical-analysis/
│   └── financial-analysis/
│
├── retail/
│   ├── inventory-management/
│   ├── sales-analysis/
│   └── supplier-analysis/
│
├── healthcare/
│   ├── hospital-operations/
│   ├── billing-analysis/
│   └── pharmacy-inventory/
│
├── manufacturing/
│   ├── production-analysis/
│   └── quality-control/
│
└── agriculture/
    ├── crop-economics/
    └── mandi-analysis/
```

### 6.2 Skill structure

Each skill should contain:

```text
inventory-management/
│
├── SKILL.md
├── tools.yaml
├── metrics.yaml
├── workflows.yaml
├── validation.yaml
└── examples/
```

Example `metrics.yaml`:

```yaml
metrics:
  - name: gross_profit
    formula: selling_price - purchase_price

  - name: gross_margin
    formula: gross_profit / selling_price * 100

  - name: stock_turnover
    description: Inventory turnover over a defined period
```

Do not assume business-specific thresholds or lead times. Allow users to configure these.

### 6.3 Memory architecture

Use PostgreSQL for:

- User preferences.
- Business profiles.
- Workbook metadata.
- Column descriptions.
- Business rules.
- Previous execution summaries.

Use Qdrant only if you need semantic retrieval over larger collections of documents or business knowledge.

### Completion criteria

You can activate a retail skill and a healthcare operations skill without changing the core agent runtime.

---

# Phase 7: Agent observability

**Duration: 3 days**

Integrate [Langfuse](https://langfuse.com/) and OpenTelemetry.

Every execution should produce a trace.

### Example trace

```text
Agent Run: run_123
│
├── User Request
│
├── Skill Selection
│   └── Inventory Management
│
├── Workbook Inspection
│   └── 4 sheets identified
│
├── Model Invocation
│
├── Tool Execution
│   ├── read_range
│   ├── calculate_margin
│   └── detect_low_margin_products
│
├── Approval
│   └── Approved
│
├── Modification
│   └── 12 cells updated
│
├── Verification
│   └── Passed
│
└── Final Response
```

Track:

- Model latency.
- Token consumption.
- Tool execution time.
- Tool failure rates.
- Failed runs.
- Approval rates.
- Verification failures.
- Reverted operations.

For sensitive datasets, redact actual cell values from traces unless there is an explicit operational need and appropriate access control.

### Completion criteria

You can investigate a failed agent run and identify precisely where it failed.

---

# Phase 8: Google Sheets integration

**Duration: 5 days**

Now introduce your first external connector.

Use:

- Google OAuth.
- Google Drive API.
- Google Sheets API.

### Implementation

1. Create Google Cloud project.
2. Configure OAuth.
3. Request minimum required scopes.
4. Authenticate users.
5. List their spreadsheets.
6. Read spreadsheet metadata.
7. Read ranges.
8. Write ranges.
9. Create sheets.
10. Apply formatting.
11. Verify changes.

Your existing spreadsheet connector interface should make this relatively straightforward.

### Important

Use provider-specific identifiers internally.

For example:

```text
workbook_id: internal identifier
provider: google_sheets
provider_workbook_id: Google spreadsheet ID
```

Do not make your agent dependent on Google's API response format.

### Completion criteria

A user can connect Google Sheets, analyse a workbook and approve modifications from your application.

---

# Phase 9: Windows Excel integration

**Duration: 7 days**

This phase addresses a major architectural challenge: your cloud application cannot directly access arbitrary files on a user's Windows computer.

I recommend a local desktop companion.

### Architecture

```text
         Next.js Application
                 |
              FastAPI
                 |
             Agent Runtime
                 |
          Authenticated Channel
                 |
          Windows Companion
                 |
             Local Files
                 |
            Excel Files
```

### Technology

- Tauri.
- Python.
- OpenPyXL.
- LibreOffice.
- Playwright, if browser interaction is required.

### Build the companion

The companion should:

1. Authenticate the device.
2. Allow users to select directories.
3. Allow users to select Excel files.
4. Receive authorised operations.
5. Execute operations locally.
6. Return results.
7. Maintain a local operation history.

Use an authenticated outbound connection. Do not expose an unrestricted local HTTP service to the internet.

### Two integration modes

**Mode A: File-based Excel**

The companion reads and modifies `.xlsx` files.

**Mode B: Live Excel**

Build an Office.js add-in to manipulate the workbook currently open in Microsoft Excel.

These are different integration problems. Start with file-based Excel and add Office.js later if live workbook editing is important.

### Completion criteria

A user can connect their Windows computer and allow your agent to operate on explicitly selected Excel files.

---

# Phase 10: Voice interaction

**Duration: 5 days**

Use [LiveKit Agents](https://docs.livekit.io/agents/) for real-time voice infrastructure.

### Architecture

```text
User Voice
    |
    v
Speech Recognition
    |
    v
Agent Runtime
    |
    v
Tool Execution
    |
    v
Response Generation
    |
    v
Text-to-Speech
    |
    v
User
```

### Features

- Voice input.
- Voice responses.
- Interruptions.
- Conversation history.
- Contextual spreadsheet references.
- Tool execution during conversations.

Example:

User:

"Show me the five products with the lowest margins."

Agent:

"Five products have margins below 8%. Would you like me to show them?"

User:

"Yes, and highlight them in red."

Agent:

- Identifies the rows.
- Creates a change set.
- Requests approval.
- Highlights the relevant cells.

Start with English. Add Hindi and other Indian languages after validating the complete voice workflow.

---

# Phase 11: Multi-tenancy and security

**Duration: 7 days**

Do not postpone the design of tenant isolation until the end. Implement basic tenant boundaries from Phase 1, then harden them here.

### Database structure

```text
tenants
users
tenant_memberships
devices
connected_sources
workbooks
workbook_versions
conversations
agent_runs
tool_executions
pending_approvals
audit_logs
business_profiles
skills
```

### Security requirements

| Area | Requirement |
|---|---|
| Authentication | Supabase Auth |
| Authorisation | Role-based permissions |
| Database | Tenant-scoped queries and RLS |
| Credentials | Encrypted storage |
| Tool execution | Permission-controlled |
| File access | Explicit file selection |
| Sandbox | Restricted Docker containers |
| Auditing | Every modification recorded |
| Data isolation | Strict tenant boundaries |
| Approval | Explicit confirmation for destructive actions |

### Introduce permission levels

For example:

```text
READ_ONLY
ANALYSE
RECOMMEND
MODIFY_WITH_APPROVAL
ADMIN
```

An agent should never be able to grant itself additional permissions.

### Completion criteria

Two tenants cannot access each other's workbooks, conversations, credentials or execution history.

---

# Phase 12: Testing, deployment and optimisation

**Duration: 7 days**

Now make the platform reliable enough for real users.

### Testing strategy

**Unit tests**

- Spreadsheet operations.
- Formula calculations.
- Data cleaning.
- Permission checks.
- Connector operations.

**Integration tests**

- Agent-to-tool execution.
- Excel file processing.
- Google Sheets operations.
- Database persistence.
- Approval workflows.

**Agent evaluation**

Create a fixed dataset of tasks and expected outcomes.

Example:

| Test | Expected outcome |
|---|---|
| Identify highest revenue product | Correct product |
| Calculate gross margins | Correct calculation |
| Detect duplicate records | Correct duplicate rows |
| Identify low inventory | Correct products |
| Update selected cells | Correct values |
| Undo modification | Original values restored |

Measure task success, numerical accuracy, unintended modifications, execution cost and latency.

### Deployment

For a cost-conscious first deployment:

| Component | Deployment |
|---|---|
| Next.js | Vercel or self-hosted |
| FastAPI | Docker |
| PostgreSQL | Supabase or self-hosted |
| Redis | Self-hosted |
| Agent runtime | Docker |
| Langfuse | Self-hosted |
| Ollama | Your own machine |
| Windows companion | User's Windows machine |

You do not need Kubernetes initially.

---

# Recommended MVP: What to build in the first 30 days

The complete roadmap is ambitious. I would narrow the first month to the following.

| Week | Development target | Demonstrable result |
|---|---|---|
| 1 | Foundation + Univer | Working spreadsheet application |
| 2 | Processing engine | Workbook analysis and editing |
| 3 | Pydantic AI + tools | Natural-language spreadsheet agent |
| 4 | Approval + verification + Langfuse | Safe, traceable modifications |

### Your first demonstration

Use a synthetic kirana store dataset.

The user uploads an Excel workbook and asks:

1. "Summarise my business performance."
2. "Which products generate the highest revenue?"
3. "Identify products with low margins."
4. "Which products are likely to run out of stock?"
5. "Create a dashboard."
6. "Highlight low-margin products."
7. "Export the updated workbook."

If your application can reliably complete these seven tasks, you have a meaningful MVP.

Do not add healthcare, manufacturing, voice, autonomous browser use or multi-agent collaboration until this workflow works reliably.

---

# 13. Important architectural decisions

I would make these decisions early and keep them consistent.

| Decision | Recommendation | Reason |
|---|---|---|
| Agent architecture | Single agent initially | Easier to debug |
| Orchestration | Custom state machine | Avoid unnecessary framework complexity |
| Agent framework | Pydantic AI | Typed Python tools |
| Tool protocol | Native registry + MCP | Internal control and external interoperability |
| Spreadsheet operations | Deterministic Python tools | Numerical reliability |
| Memory | PostgreSQL | Structured, persistent memory |
| Model selection | LiteLLM | Provider independence |
| Execution | Restricted Docker | Isolation |
| Long-running tasks | Temporal later | Durable execution |
| Domain adaptation | Skills | Reusable domain knowledge |
| Browser | Playwright | Deterministic automation |
| Observability | Langfuse | Agent debugging |

## 14. What not to build yet

These are distractions during the MVP:

- Multiple collaborating autonomous agents.
- A sophisticated vector memory system.
- Kubernetes infrastructure.
- Fully autonomous browser control.
- A custom LLM.
- A complex workflow builder.
- Ten industry-specific skill packs.
- Fully real-time voice.
- A custom Excel formula calculation engine.

First prove that the agent can correctly understand, analyse, modify and verify spreadsheet data.

---

## 15. Definition of success

I would use these milestones to decide whether to progress:

| Milestone | Success condition |
|---|---|
| Spreadsheet engine | Correct deterministic operations |
| Agent | Correctly selects tools and completes tasks |
| Verification | Detects incorrect or incomplete modifications |
| Memory | Remembers business rules without relying on stale data |
| Skills | Supports multiple domains without core code changes |
| Connectors | Supports local Excel and Google Sheets |
| Security | Enforces tenant and tool permissions |
| Observability | Every run can be reconstructed |
| Voice | Can complete spreadsheet workflows through conversation |

**My strongest advice:** Treat this as building an agent operating system for structured business data, not an Excel chatbot. The real product value will come from reliable execution, domain knowledge, connectors, permissions and verification—not from how sophisticated the LLM appears.

**Next practical step:** Start with Phase 0 and Phase 1, then implement the Univer spreadsheet interface. Don't begin with autonomous agent loops. Build the deterministic spreadsheet operations first.
