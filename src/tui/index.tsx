#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import React, { useState, useEffect } from "react";
import { render, Box, Text, useInput, useStdout, Spacer } from "ink";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// Import v2.0 components
import { PlayerPiano } from "./components/PlayerPiano";
import { XRayPanel } from "./components/XRayPanel";
import { VoiceInputUI } from "./components/VoiceInput";

interface GalleryEntry {
  projectName: string;
  path: string;
  iterations: string[];
}

interface LogEntry {
  type: "info" | "code" | "success" | "error" | "iteration" | "system" | "llm";
  message: string;
  timestamp: number;
}

interface Iteration {
  id: number;
  code: string;
  timestamp: number;
  quality?: number;
  reason?: string;
}

const COLORS = {
  primary: "cyan", success: "green", warning: "yellow", error: "red",
  muted: "gray", border: "gray", code: "green", info: "blue",
  highlight: "magenta", llm: "yellow",
};

async function loadGallery(): Promise<GalleryEntry[]> {
  try {
    const galleryDir = path.join(PROJECT_ROOT, "gallery");
    const entries = await fs.readdir(galleryDir, { withFileTypes: true });
    const projects: GalleryEntry[] = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = path.join(galleryDir, entry.name);
        const files = await fs.readdir(projectPath);
        const iterations = files.filter(f => f.endsWith(".js")).sort();
        projects.push({ projectName: entry.name, path: projectPath, iterations });
      }
    }
    return projects.sort((a, b) => b.projectName.localeCompare(a.projectName));
  } catch { return []; }
}

function useTerminalSize() {
  const { stdout } = useStdout();
  const [size, setSize] = useState({ rows: 40, columns: 120 });
  useEffect(() => {
    const updateSize = () => setSize({ rows: stdout.rows || 40, columns: stdout.columns || 120 });
    updateSize();
    stdout.on("resize", updateSize);
    return () => { stdout.off("resize", updateSize); };
  }, [stdout]);
  return size;
}

const Banner = () => (
  <Box borderStyle="double" borderColor={COLORS.primary} paddingX={1} marginBottom={1}>
    <Text bold color={COLORS.primary}>ATELIER TUI v2.0</Text>
    <Spacer />
    <Text color={COLORS.muted}>Creative Coding Agent</Text>
  </Box>
);

const LogsPanel = ({ logs, height }: { logs: LogEntry[]; height: number }) => {
  const displayLogs = logs.slice(-(height - 3));
  return (
    <Box flexDirection="column" borderStyle="single" borderColor={COLORS.border} width="20%" height={height} paddingX={1}>
      <Box marginBottom={1}><Text bold color={COLORS.info}>LOGS</Text><Text color={COLORS.muted}> (Streaming)</Text></Box>
      <Box flexDirection="column" flexGrow={1}>
        {displayLogs.map((log, i) => (
          <Box key={i}>
            <Text color={log.type === "error" ? COLORS.error : log.type === "success" ? COLORS.success : log.type === "code" ? COLORS.code : log.type === "llm" ? COLORS.llm : log.type === "iteration" ? COLORS.warning : log.type === "system" ? COLORS.highlight : COLORS.muted}>
              {log.type === "llm" ? "⚡ " : log.type === "iteration" ? "↻ " : log.type === "success" ? "✓ " : log.type === "error" ? "✗ " : "> "}
              {log.message.length > 25 ? log.message.slice(0, 25) + ".." : log.message}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const GalleryPanel = ({ projects, currentIndex, onSelect, height }: any) => {
  useInput((_input: string, key: any) => {
    if (key.upArrow) onSelect(Math.max(0, currentIndex - 1));
    else if (key.downArrow) onSelect(Math.min(projects.length - 1, currentIndex + 1));
  });
  return (
    <Box flexDirection="column" borderStyle="single" borderColor={COLORS.border} width="20%" height={height} paddingX={1}>
      <Box marginBottom={1}><Text bold color={COLORS.success}>GALLERY</Text><Text color={COLORS.muted}> ({projects.length})</Text></Box>
      <Box flexDirection="column" flexGrow={1}>
        {projects.slice(0, height - 6).map((project: GalleryEntry, index: number) => (
          <Box key={project.projectName}>
            <Text color={index === currentIndex ? COLORS.primary : COLORS.muted}>{index === currentIndex ? "> " : "  "}</Text>
            <Text color={index === currentIndex ? "white" : COLORS.muted} bold={index === currentIndex}>{project.projectName.slice(0, 10)}</Text>
            <Text color={COLORS.muted}>({project.iterations.length})</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const PromptBar = ({ value, onChange, onSubmit, disabled }: any) => {
  useInput((_input: string, key: any) => {
    if (disabled) return;
    if (key.return) onSubmit();
    else if (key.backspace || key.delete) onChange(value.slice(0, -1));
    else if (_input) onChange(value + _input);
  });
  return (
    <Box borderStyle="round" borderColor={disabled ? COLORS.muted : COLORS.primary} paddingX={1} marginBottom={1}>
      <Text bold color={disabled ? COLORS.muted : COLORS.primary}>Prompt:</Text>
      <Text color={disabled ? COLORS.muted : "white"}> {value || (disabled ? "[Generating...]" : "Type prompt...")}</Text>
      <Spacer />
      {disabled ? <Text color={COLORS.warning}>Working...</Text> : value ? <Text color={COLORS.success}>[ENTER]</Text> : <Text color={COLORS.muted}>[ESC]</Text>}
    </Box>
  );
};

const App = ({ initialGallery }: { initialGallery: GalleryEntry[] }) => {
  const { rows } = useTerminalSize();
  const contentHeight = Math.max(20, rows - 10);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "system", message: "Atelier TUI v2.0 initialized", timestamp: Date.now() },
    { type: "info", message: `Loaded ${initialGallery.length} projects`, timestamp: Date.now() },
    { type: "info", message: "v2.0: PlayerPiano + X-Ray + Voice ready", timestamp: Date.now() },
  ]);
  const [currentIterations, setCurrentIterations] = useState<Iteration[]>([]);
  const [gallery, setGallery] = useState<GalleryEntry[]>(initialGallery);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [playerPianoIndex, setPlayerPianoIndex] = useState(0);
  const [isPlayerPianoPlaying, setIsPlayerPianoPlaying] = useState(false);
  const rawLLMOutput = useState<string[]>([])[0];
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const addLog = (type: LogEntry["type"], message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: Date.now() }].slice(-100));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    addLog("info", `Starting: "${prompt.slice(0, 30)}..."`);
    addLog("llm", "→ LLM Request: inception/inception-001");
    addLog("llm", `  Prompt: ~${prompt.length + 2000} chars`);
    
    const projectName = `project-${Date.now()}`;
    try {
      const { run } = await import(path.join(PROJECT_ROOT, "dist/index.js"));
      const startTime = Date.now();
      const result = await run(prompt, { maxIterations: 10, timeoutMinutes: 5, galleryDir: "gallery", project: projectName });
      const duration = Date.now() - startTime;
      
      addLog("llm", `← LLM Response: ${result.code.length} chars`);
      addLog("llm", `  Time: ${duration}ms`);
      addLog("success", `Complete: ${result.iterations} iters`);
      
      const iterations: Iteration[] = Array.from({ length: result.iterations }, (_, i) => ({
        id: i + 1,
        code: result.code,
        timestamp: Date.now() - (result.iterations - i) * 1000,
      }));
      setCurrentIterations(iterations);
      setPlayerPianoIndex(iterations.length - 1);
      
      const newGallery = await loadGallery();
      setGallery(newGallery);
    } catch (err: any) {
      addLog("error", `Failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGallerySelect = async (index: number) => {
    setGalleryIndex(index);
    const project = gallery[index];
    if (project) {
      addLog("info", `Selected: ${project.projectName}`);
    }
  };

  useInput((input: string) => {
    if (input === "q") process.exit(0);
    if (input === "1") setIsPlayerPianoPlaying(prev => !prev);
    if (input === "v") setShowVoiceInput(prev => !prev);
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Banner />
      <PromptBar value={prompt} onChange={setPrompt} onSubmit={handleGenerate} disabled={isGenerating} />
      <Box flexDirection="row" gap={1}>
        <LogsPanel logs={logs} height={contentHeight} />
        <PlayerPiano
          iterations={currentIterations}
          currentIndex={playerPianoIndex}
          isPlaying={isPlayerPianoPlaying}
          speed={200}
          onIndexChange={setPlayerPianoIndex}
          onTogglePlay={() => setIsPlayerPianoPlaying(prev => !prev)}
        />
        <XRayPanel
          iterations={currentIterations}
          currentIndex={playerPianoIndex}
          rawOutput={rawLLMOutput}
          isStreaming={isGenerating}
        />
        {showVoiceInput && (
          <Box flexDirection="column" borderStyle="single" borderColor={COLORS.border} width="20%" height={contentHeight} paddingX={1}>
            <VoiceInputUI />
          </Box>
        )}
        <GalleryPanel projects={gallery} currentIndex={galleryIndex} onSelect={handleGallerySelect} height={contentHeight} />
      </Box>
      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} marginTop={1}>
        <Text color={COLORS.muted}>Status: {isGenerating ? "Generating..." : "Ready"} | [1] PlayerPiano | [V]oice | [Q]uit</Text>
      </Box>
    </Box>
  );
};

const main = async () => {
  const initialGallery = await loadGallery();
  render(<App initialGallery={initialGallery} />);
};

main().catch(console.error);
