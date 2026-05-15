import {
  AttachmentRecord,
  CommandResult,
  CommandSpec,
  EventRecord,
  NotificationItem,
  SessionContext,
  SessionExport,
  SessionSummary,
  SessionUsage,
  ShareRecord,
} from "../types";
import {
  AgentSummary,
  ApiClient,
  MarketplacePlugin,
  ModelInfo,
  PluginSummary,
  ProjectBranches,
  ProjectSummary,
  SkillSummary,
  ToolSummary,
  VirtualProject,
  WorktreeSummary,
} from "./contracts";

const now = Date.now();
const iso = (offsetMs = 0) => new Date(now + offsetMs).toISOString();

let sessions: SessionSummary[] = [
  {
    session_id: "demo-portfolio-001",
    title: "Build offline demo mode for the MaxQ console",
    created_at: iso(-45 * 60_000),
    status: "completed",
    done_reason: "completed",
    running: false,
    context: {
      project: "Assistant",
      repo: "bearlike/Assistant",
      branch: "feature/offline-demo",
      model: "openai/gpt-5.2",
      mcp_tools: ["tool-fs-read", "tool-fs-write", "tool-shell-run"],
    },
  },
  {
    session_id: "demo-portfolio-002",
    title: "Review plugin marketplace UX and loading states",
    created_at: iso(-3 * 60 * 60_000),
    status: "completed",
    done_reason: "completed",
    running: false,
    context: {
      project: "Assistant",
      repo: "bearlike/Assistant",
      branch: "main",
      model: "openai/claude-sonnet-4-6",
      mcp_tools: ["tool-fs-read"],
    },
  },
  {
    session_id: "demo-portfolio-003",
    title: "Add test coverage for session timeline parsing",
    created_at: iso(-28 * 60 * 60_000),
    status: "completed",
    done_reason: "completed",
    running: false,
    context: {
      project: "Assistant",
      repo: "bearlike/Assistant",
      branch: "test/timeline-fixtures",
      model: "openai/gpt-5.2",
      mcp_tools: ["tool-fs-read", "tool-shell-run"],
    },
  },
];

let archivedSessions: SessionSummary[] = [
  {
    session_id: "demo-archive-001",
    title: "Prototype command palette navigation",
    created_at: iso(-16 * 24 * 60 * 60_000),
    status: "completed",
    done_reason: "completed",
    running: false,
    archived: true,
    context: {
      project: "Assistant",
      repo: "bearlike/Assistant",
      branch: "prototype/commands",
      model: "openai/gpt-5.2",
      mcp_tools: ["tool-fs-read"],
    },
  },
];

let notifications: NotificationItem[] = [
  {
    id: "demo-notification-1",
    title: "Offline demo mode ready",
    message: "The console can now be shown without an API server.",
    level: "info",
    created_at: iso(-20 * 60_000),
    event_type: "completed",
    session_id: "demo-portfolio-001",
  },
  {
    id: "demo-notification-2",
    title: "Portfolio data loaded",
    message: "Seed sessions, tools, projects, plugins, and settings are active.",
    level: "info",
    created_at: iso(-10 * 60_000),
    event_type: "demo",
  },
];

let virtualProjects: VirtualProject[] = [
  {
    project_id: "project-assistant",
    name: "Assistant",
    description: "Resume-ready MaxQ console demo workspace",
    path: "C:/Users/ompat/OneDrive/Documents/CSULB/Projects/Assistant",
    path_source: "managed",
    folder_created: false,
    created_at: iso(-2 * 24 * 60 * 60_000),
    updated_at: iso(-45 * 60_000),
  },
  {
    project_id: "project-csulb-planner",
    name: "CSULB Planner",
    description: "Course planning project used as a second demo context",
    path: "C:/Users/ompat/OneDrive/Documents/CSULB/Projects/csulb-planner",
    path_source: "managed",
    folder_created: false,
    created_at: iso(-8 * 24 * 60 * 60_000),
    updated_at: iso(-4 * 24 * 60 * 60_000),
  },
];

let installedPlugins: PluginSummary[] = [
  {
    name: "resume-case-study",
    description: "Adds local showcase prompts and interview-ready project summaries.",
    version: "0.1.0",
    marketplace: "local",
    scope: "project",
    skills: 2,
    agents: 1,
    commands: 1,
    mcp_servers: 0,
    has_hooks: false,
  },
];

let config: Record<string, unknown> = {
  agent: {
    default_model: "openai/gpt-5.2",
    web_ide: { enabled: false },
    max_concurrent: 3,
  },
  llm: {
    provider: "demo",
    proxy_model_prefix: "openai",
  },
  langfuse: {
    enabled: false,
  },
};

const tools: ToolSummary[] = [
  {
    tool_id: "tool-fs-read",
    name: "read_file",
    kind: "builtin",
    enabled: true,
    description: "Read source files in the active workspace.",
    scope: "project",
  },
  {
    tool_id: "tool-fs-write",
    name: "edit_file",
    kind: "builtin",
    enabled: true,
    description: "Apply reviewed file edits.",
    scope: "project",
  },
  {
    tool_id: "tool-shell-run",
    name: "run_command",
    kind: "builtin",
    enabled: true,
    description: "Run build, test, and lint commands.",
    scope: "project",
  },
  {
    tool_id: "tool-github-pr",
    name: "create_pr",
    kind: "mcp",
    enabled: false,
    disabled_reason: "GitHub connector is not configured in demo mode.",
    description: "Create and update pull requests.",
    server: "github",
  },
];

const skills: SkillSummary[] = [
  {
    name: "resume-demo",
    description: "Prepare a concise project walkthrough for interviews.",
    allowed_tools: null,
    user_invocable: true,
    disable_model_invocation: false,
    context: "Assistant",
    source: "project",
  },
  {
    name: "review-change",
    description: "Review a patch for regressions, missing tests, and UX issues.",
    allowed_tools: null,
    user_invocable: true,
    disable_model_invocation: false,
    context: "Assistant",
    source: "project",
  },
];

const marketplacePlugins: MarketplacePlugin[] = [
  {
    name: "resume-case-study",
    description: "Local prompts for portfolio demos and interview prep.",
    category: "productivity",
    marketplace: "local",
    installed: true,
  },
  {
    name: "github-workflow",
    description: "Issue triage and pull request assistant workflows.",
    category: "engineering",
    marketplace: "local",
    installed: false,
  },
  {
    name: "course-planner-agent",
    description: "CSULB schedule planning tools for a second project demo.",
    category: "education",
    marketplace: "local",
    installed: false,
  },
];

const demoDiff = `--- a/apps/mewbo_console/src/api/client.ts
+++ b/apps/mewbo_console/src/api/client.ts
@@ -1,6 +1,9 @@
 import { createRealClient } from './realClient';
+import { createMockClient } from './mockClient';
 
-const realClient = createRealClient({ baseUrl: API_BASE, apiKey: API_KEY });
+export const API_MODE = import.meta.env.VITE_API_MODE ?? 'auto';
+const client = API_MODE === 'mock'
+  ? createMockClient()
+  : createRealClient({ baseUrl: API_BASE, apiKey: API_KEY });`;

const eventCache = new Map<string, EventRecord[]>();

function makeEvents(session: SessionSummary, query?: string): EventRecord[] {
  const start = session.created_at || iso(-60_000);
  const base = new Date(start).getTime();
  const at = (ms: number) => new Date(base + ms).toISOString();
  const userText =
    query ||
    "Add an offline demo mode so the console can be shown on a resume without running the Python API.";

  return [
    {
      ts: at(0),
      type: "context",
      payload: {
        model: session.context?.model || "openai/gpt-5.2",
        project: session.context?.project || "Assistant",
      },
    },
    {
      ts: at(1000),
      type: "user",
      payload: { text: userText },
    },
    {
      ts: at(3500),
      type: "action_plan",
      payload: {
        steps: [
          {
            title: "Add a mock API client",
            description: "Mirror the real API contract with in-memory demo data.",
          },
          {
            title: "Expose demo build scripts",
            description: "Let the console run with VITE_API_MODE=mock.",
          },
          {
            title: "Verify the production build",
            description: "Run TypeScript and Vite checks after wiring the mode.",
          },
        ],
      },
    },
    {
      ts: at(7000),
      type: "tool_result",
      payload: {
        tool_id: "run_command",
        operation: "run",
        tool_input: { command: "rg \"VITE_API_MODE|createRealClient\" src" },
        summary: "Found the client facade that selects the API implementation.",
        result: JSON.stringify({
          kind: "shell",
          command: "rg \"VITE_API_MODE|createRealClient\" src",
          cwd: "/workspace/Assistant/apps/mewbo_console",
          exit_code: 0,
          stdout: "src/api/client.ts:import { createRealClient } from './realClient';",
          stderr: "",
          duration_ms: 82,
        }),
        success: true,
      },
    },
    {
      ts: at(11_000),
      type: "tool_result",
      payload: {
        tool_id: "edit_file",
        operation: "apply_patch",
        tool_input: { path: "apps/mewbo_console/src/api/client.ts" },
        summary: "Wired VITE_API_MODE=mock to the console API facade.",
        result: demoDiff,
        success: true,
      },
    },
    {
      ts: at(14_000),
      type: "sub_agent",
      payload: {
        action: "start",
        agent_id: "demo-agent-build",
        parent_id: null,
        depth: 1,
        model: "openai/gpt-5.2",
        detail: "Verify demo mode build and smoke-test seeded data",
        status: "running",
        steps_completed: 0,
      },
    },
    {
      ts: at(18_000),
      type: "tool_result",
      payload: {
        tool_id: "run_command",
        operation: "run",
        tool_input: { command: "npm run build:demo" },
        summary: "Demo build completed successfully.",
        result: JSON.stringify({
          kind: "shell",
          command: "npm run build:demo",
          cwd: "/workspace/Assistant/apps/mewbo_console",
          exit_code: 0,
          stdout: "vite v5.4.21 building for production...\n✓ built in 41s",
          stderr: "",
          duration_ms: 41_000,
        }),
        success: true,
      },
    },
    {
      ts: at(20_000),
      type: "sub_agent",
      payload: {
        action: "stop",
        agent_id: "demo-agent-build",
        parent_id: null,
        depth: 1,
        model: "openai/gpt-5.2",
        detail: "completed",
        status: "completed",
        steps_completed: 3,
      },
    },
    {
      ts: at(21_000),
      type: "tool_result",
      payload: {
        tool_id: "spawn_agent",
        operation: "run",
        tool_input: { task: "Verify demo build" },
        result: JSON.stringify({
          content: "Demo mode rendered seeded sessions, tools, projects, and notifications.",
          status: "completed",
          steps_used: 3,
          summary: "Build and smoke-test passed.",
          artifacts: ["apps/mewbo_console/src/api/mockClient.ts"],
          warnings: [],
        }),
        success: true,
      },
    },
    {
      ts: at(23_000),
      type: "llm_call_end",
      payload: {
        depth: 0,
        model: session.context?.model || "openai/gpt-5.2",
        input_tokens: 18_240,
        output_tokens: 1260,
        cache_read_input_tokens: 9200,
        cache_creation_input_tokens: 1800,
        reasoning_output_tokens: 420,
      },
    },
    {
      ts: at(24_000),
      type: "assistant",
      payload: {
        text:
          "Done. The console now has a backend-free demo path with realistic sessions, tool results, notifications, projects, plugins, and settings.\n\n" +
          "Verification completed with `npm run build:demo`. This makes the project easy to present in a portfolio because the UI can be run without API keys or infrastructure.",
      },
    },
    {
      ts: at(25_000),
      type: "completion",
      payload: { done: true, done_reason: "completed" },
    },
  ];
}

function makeUsage(): SessionUsage {
  return {
    root_model: "openai/gpt-5.2",
    root_max_input_tokens: 128_000,
    root_last_input_tokens: 18_240,
    root_utilization: 0.1425,
    tokens_until_compact: 83_000,
    compact_threshold: 0.8,
    root_peak_input_tokens: 18_240,
    sub_peak_input_tokens: 8300,
    root_input_tokens_billed: 41_500,
    sub_input_tokens_billed: 10_300,
    total_input_tokens_billed: 51_800,
    root_output_tokens: 1260,
    sub_output_tokens: 620,
    total_output_tokens: 1880,
    root_cache_creation_tokens: 1800,
    root_cache_read_tokens: 9200,
    root_reasoning_tokens: 420,
    sub_cache_creation_tokens: 0,
    sub_cache_read_tokens: 2100,
    sub_reasoning_tokens: 80,
    total_cache_creation_tokens: 1800,
    total_cache_read_tokens: 11_300,
    total_reasoning_tokens: 500,
    root_llm_calls: 4,
    sub_llm_calls: 2,
    sub_agent_count: 1,
    compaction_count: 0,
    compaction_tokens_saved: 0,
  };
}

function findSession(sessionId: string): SessionSummary | undefined {
  return [...sessions, ...archivedSessions].find((session) => session.session_id === sessionId);
}

function updateSession(sessionId: string, patch: Partial<SessionSummary>) {
  sessions = sessions.map((session) =>
    session.session_id === sessionId ? { ...session, ...patch } : session
  );
  archivedSessions = archivedSessions.map((session) =>
    session.session_id === sessionId ? { ...session, ...patch } : session
  );
}

function titleFromQuery(query: string): string {
  const trimmed = query.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return "Untitled demo task";
  }
  return trimmed.length > 72 ? `${trimmed.slice(0, 69)}...` : trimmed;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function createMockClient(): ApiClient {
  return {
    async listSessions(includeArchived = false): Promise<SessionSummary[]> {
      await delay(80);
      return includeArchived
        ? [...sessions, ...archivedSessions]
        : sessions.filter((session) => !session.archived);
    },

    async createSession(context?: SessionContext): Promise<string> {
      await delay(100);
      const sessionId = `demo-${Math.random().toString(36).slice(2, 9)}`;
      sessions = [
        {
          session_id: sessionId,
          title: "New demo task",
          created_at: new Date().toISOString(),
          status: "running",
          done_reason: null,
          running: true,
          context: {
            project: "Assistant",
            model: "openai/gpt-5.2",
            ...context,
          },
        },
        ...sessions,
      ];
      return sessionId;
    },

    async postQuery(sessionId, query, context, mode, attachments): Promise<void> {
      void mode;
      await delay(120);
      const session = findSession(sessionId);
      if (!session) return;
      const updated: SessionSummary = {
        ...session,
        title: titleFromQuery(query),
        status: "completed",
        done_reason: "completed",
        running: false,
        context: {
          ...session.context,
          ...context,
          attachments,
        },
      };
      updateSession(sessionId, updated);
      eventCache.set(sessionId, makeEvents(updated, query));
    },

    async fetchEvents(sessionId, after): Promise<{ events: EventRecord[]; running: boolean }> {
      await delay(80);
      const session = findSession(sessionId);
      if (!session) {
        return { events: [], running: false };
      }
      if (!eventCache.has(sessionId)) {
        eventCache.set(sessionId, makeEvents(session));
      }
      if (after) {
        return { events: [], running: Boolean(session.running) };
      }
      return { events: eventCache.get(sessionId) || [], running: Boolean(session.running) };
    },

    async fetchUsage(): Promise<SessionUsage> {
      await delay(40);
      return makeUsage();
    },

    async archiveSession(sessionId): Promise<void> {
      await delay(80);
      const index = sessions.findIndex((session) => session.session_id === sessionId);
      if (index === -1) return;
      const [session] = sessions.splice(index, 1);
      archivedSessions = [{ ...session, archived: true }, ...archivedSessions];
    },

    async unarchiveSession(sessionId): Promise<void> {
      await delay(80);
      const index = archivedSessions.findIndex((session) => session.session_id === sessionId);
      if (index === -1) return;
      const [session] = archivedSessions.splice(index, 1);
      sessions = [{ ...session, archived: false }, ...sessions];
    },

    async updateSessionTitle(sessionId, title): Promise<{ session_id: string; title: string }> {
      await delay(50);
      updateSession(sessionId, { title });
      return { session_id: sessionId, title };
    },

    async regenerateTitle(sessionId): Promise<{ session_id: string; title: string }> {
      await delay(80);
      const title = "Offline demo mode for AI orchestration console";
      updateSession(sessionId, { title });
      return { session_id: sessionId, title };
    },

    async uploadAttachments(_sessionId, files): Promise<AttachmentRecord[]> {
      await delay(80);
      return files.map((file, index) => ({
        id: `demo-attachment-${index + 1}`,
        filename: file.name,
        stored_name: file.name,
        content_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        uploaded_at: new Date().toISOString(),
      }));
    },

    async createShare(sessionId): Promise<ShareRecord> {
      await delay(50);
      return {
        token: `demo-share-${sessionId}`,
        session_id: sessionId,
        created_at: new Date().toISOString(),
      };
    },

    async exportSession(sessionId): Promise<SessionExport> {
      await delay(80);
      return {
        session_id: sessionId,
        events: eventCache.get(sessionId) || makeEvents(findSession(sessionId) || sessions[0]),
        summary: "Demo export generated entirely in the browser.",
        created_at: new Date().toISOString(),
      };
    },

    async resolveShare(token): Promise<SessionExport> {
      await delay(80);
      const sessionId = token.replace("demo-share-", "");
      return {
        token,
        session_id: sessionId,
        events: eventCache.get(sessionId) || [],
        summary: "Resolved from the local demo client.",
      };
    },

    async sendMessage(sessionId, text): Promise<void> {
      await delay(80);
      const session = findSession(sessionId);
      if (!session) return;
      const nextEvents = [
        ...(eventCache.get(sessionId) || makeEvents(session)),
        {
          ts: new Date().toISOString(),
          type: "user_steer",
          payload: { text },
        },
      ];
      eventCache.set(sessionId, nextEvents);
    },

    async interruptStep(sessionId): Promise<void> {
      await delay(50);
      updateSession(sessionId, { status: "incomplete", done_reason: "canceled", running: false });
    },

    async approvePlan(sessionId, approved): Promise<void> {
      await delay(50);
      const session = findSession(sessionId);
      if (!session) return;
      eventCache.set(sessionId, [
        ...(eventCache.get(sessionId) || makeEvents(session)),
        {
          ts: new Date().toISOString(),
          type: approved ? "plan_approved" : "plan_rejected",
          payload: { revision: 1 },
        },
      ]);
    },

    async recoverSession(sessionId): Promise<void> {
      await delay(100);
      updateSession(sessionId, { status: "completed", done_reason: "completed", running: false });
    },

    async forkSession(sessionId, opts): Promise<{
      session_id: string;
      forked_from: string;
      forked_at: string | null;
    }> {
      await delay(100);
      const source = findSession(sessionId) || sessions[0];
      const forkedId = `demo-fork-${Math.random().toString(36).slice(2, 8)}`;
      const forked: SessionSummary = {
        ...source,
        session_id: forkedId,
        title: `${source.title} (fork)`,
        created_at: new Date().toISOString(),
        context: {
          ...source.context,
          model: opts?.model || source.context?.model,
        },
      };
      sessions = [forked, ...sessions];
      eventCache.set(forkedId, eventCache.get(sessionId) || makeEvents(source));
      return {
        session_id: forkedId,
        forked_from: sessionId,
        forked_at: opts?.fromTs || null,
      };
    },

    async fetchPlanMarkdown(): Promise<string> {
      await delay(40);
      return [
        "# Demo Implementation Plan",
        "",
        "1. Add a mock API client that satisfies the console contract.",
        "2. Wire `VITE_API_MODE=mock` into the API facade.",
        "3. Verify with TypeScript and Vite production builds.",
      ].join("\n");
    },

    async listTools(): Promise<ToolSummary[]> {
      await delay(60);
      return tools;
    },

    async listSkills(): Promise<SkillSummary[]> {
      await delay(60);
      return skills;
    },

    streamEvents(sessionId, onEvent, onEnd): () => void {
      const session = findSession(sessionId);
      const events = eventCache.get(sessionId) || (session ? makeEvents(session) : []);
      let index = 0;
      const timer = window.setInterval(() => {
        const next = events[index];
        if (!next) {
          window.clearInterval(timer);
          onEnd();
          return;
        }
        onEvent(next);
        index += 1;
      }, 80);
      return () => window.clearInterval(timer);
    },

    async listModels(): Promise<ModelInfo> {
      await delay(50);
      return {
        default: "openai/gpt-5.2",
        models: ["openai/gpt-5.2", "openai/claude-sonnet-4-6", "openai/gpt-4.1"],
        capabilities: {
          "openai/gpt-5.2": { supports_vision: true },
          "openai/claude-sonnet-4-6": { supports_vision: true },
          "openai/gpt-4.1": { supports_vision: true },
        },
      };
    },

    async listProjects(): Promise<ProjectSummary[]> {
      await delay(60);
      return virtualProjects.map((project) => ({
        name: project.name,
        path: project.path,
        description: project.description,
        source: "managed",
        project_id: project.project_id,
        is_worktree: project.is_worktree,
        parent_project_id: project.parent_project_id,
        branch: project.branch,
      }));
    },

    async listNotifications(): Promise<NotificationItem[]> {
      await delay(60);
      return notifications;
    },

    async dismissNotification(ids): Promise<void> {
      await delay(40);
      notifications = notifications.filter((notification) => !ids.includes(notification.id));
    },

    async clearNotifications(): Promise<void> {
      await delay(40);
      notifications = [];
    },

    async listAgents(): Promise<{
      agents: AgentSummary[];
      running: boolean;
      total_steps: number;
      total_input_tokens: number;
      total_output_tokens: number;
    }> {
      await delay(60);
      return {
        agents: [
          {
            agent_id: "demo-agent-build",
            parent_id: null,
            depth: 1,
            model: "openai/gpt-5.2",
            action: "stop",
            status: "completed",
            steps_completed: 3,
            input_tokens: 8300,
            output_tokens: 620,
            detail: "Verified demo mode build and seeded data.",
            ts: iso(-20_000),
          },
        ],
        running: false,
        total_steps: 3,
        total_input_tokens: 8300,
        total_output_tokens: 620,
      };
    },

    async getConfigSchema(): Promise<Record<string, unknown>> {
      await delay(50);
      return {
        type: "object",
        properties: {
          agent: {
            type: "object",
            title: "Agent",
            properties: {
              default_model: { type: "string", title: "Default model" },
              max_concurrent: { type: "number", title: "Max concurrent agents" },
              web_ide: {
                type: "object",
                title: "Web IDE",
                properties: {
                  enabled: { type: "boolean", title: "Enabled" },
                },
              },
            },
          },
          langfuse: {
            type: "object",
            title: "Langfuse",
            properties: {
              enabled: { type: "boolean", title: "Enabled" },
            },
          },
        },
      };
    },

    async getConfig(): Promise<Record<string, unknown>> {
      await delay(50);
      return config;
    },

    async patchConfig(patch): Promise<Record<string, unknown>> {
      await delay(80);
      config = { ...config, ...patch };
      return config;
    },

    async listPlugins(): Promise<PluginSummary[]> {
      await delay(70);
      return installedPlugins;
    },

    async listMarketplacePlugins(): Promise<MarketplacePlugin[]> {
      await delay(70);
      const installed = new Set(installedPlugins.map((plugin) => plugin.name));
      return marketplacePlugins.map((plugin) => ({
        ...plugin,
        installed: installed.has(plugin.name),
      }));
    },

    async installPlugin(name, marketplace): Promise<void> {
      await delay(100);
      if (installedPlugins.some((plugin) => plugin.name === name)) return;
      installedPlugins = [
        ...installedPlugins,
        {
          name,
          description: `Installed from ${marketplace}.`,
          version: "0.1.0",
          marketplace,
          scope: "user",
          skills: 1,
          agents: 0,
          commands: 1,
          mcp_servers: 0,
          has_hooks: false,
        },
      ];
    },

    async uninstallPlugin(name): Promise<void> {
      await delay(80);
      installedPlugins = installedPlugins.filter((plugin) => plugin.name !== name);
    },

    async createVirtualProject(name, description, path): Promise<VirtualProject> {
      await delay(90);
      const project: VirtualProject = {
        project_id: `project-${Math.random().toString(36).slice(2, 8)}`,
        name,
        description,
        path: path || `C:/tmp/${name.toLowerCase().replace(/\s+/g, "-")}`,
        path_source: path ? "user" : "managed",
        folder_created: !path,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      virtualProjects = [project, ...virtualProjects];
      return project;
    },

    async updateVirtualProject(id, data): Promise<VirtualProject> {
      await delay(80);
      virtualProjects = virtualProjects.map((project) =>
        project.project_id === id
          ? { ...project, ...data, updated_at: new Date().toISOString() }
          : project
      );
      const updated = virtualProjects.find((project) => project.project_id === id);
      if (!updated) {
        throw new Error("Project not found");
      }
      return updated;
    },

    async deleteVirtualProject(id): Promise<void> {
      await delay(80);
      virtualProjects = virtualProjects.filter((project) => project.project_id !== id);
    },

    async listProjectBranches(): Promise<ProjectBranches> {
      await delay(60);
      return {
        branches: ["main", "feature/offline-demo", "test/timeline-fixtures"],
        current_branch: "feature/offline-demo",
        git_repo: true,
      };
    },

    async listWorktrees(projectId): Promise<WorktreeSummary[]> {
      await delay(70);
      const parent = virtualProjects.find((project) => project.project_id === projectId);
      return [
        {
          project_id: "worktree-demo",
          name: "Assistant demo worktree",
          branch: "feature/offline-demo",
          path: `${parent?.path || "C:/tmp/Assistant"}/../Assistant-demo`,
          managed: true,
          is_worktree: true,
          parent_project_id: projectId,
          parent_path: parent?.path,
          clean: true,
          head: "e640b25",
        },
      ];
    },

    async createWorktree(projectId, branch): Promise<WorktreeSummary> {
      await delay(100);
      return {
        project_id: `worktree-${Math.random().toString(36).slice(2, 8)}`,
        name: `${branch} worktree`,
        branch,
        path: `C:/tmp/${branch.replace(/\W+/g, "-")}`,
        managed: true,
        is_worktree: true,
        parent_project_id: projectId,
        clean: true,
        head: "demo",
      };
    },

    async deleteWorktree(): Promise<void> {
      await delay(80);
    },

    async fetchCommands(): Promise<CommandSpec[]> {
      await delay(50);
      return [
        {
          name: "resume-summary",
          description: "Generate a concise project summary for interview prep.",
          usage: "/resume-summary",
          render: "dialog",
        },
      ];
    },

    async executeCommand(): Promise<CommandResult> {
      await delay(80);
      return {
        render: "dialog",
        title: "Resume Summary",
        body: "Built an offline demo mode for a React + Vite AI orchestration console, enabling seeded portfolio demos without backend infrastructure.",
        metadata: { source: "mockClient" },
      };
    },
  };
}

export async function fetchMockGitDiff(): Promise<{
  git_repo: boolean;
  reason?: string;
  diff?: string;
}> {
  await delay(50);
  return {
    git_repo: true,
    diff: demoDiff,
  };
}
