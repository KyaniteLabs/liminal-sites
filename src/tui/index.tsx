#!/usr/bin/env node
/**
 * Atelier TUI - Terminal User Interface
 * 
 * Rich interactive interface for Atelier creative coding agent.
 * Features:
 * - Prompt input panel
 * - Live preview pane (screenshots from Gallery)
 * - Gallery navigation (arrow keys to browse iterations)
 * - Controls: Generate/Stop/Export
 */

import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput } from 'ink';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Types
interface GalleryEntry {
	projectName: string;
	path: string;
	iterations: string[];
}

// Load gallery synchronously at startup
async function loadGallerySync(): Promise<GalleryEntry[]> {
	try {
		const galleryDir = path.join(PROJECT_ROOT, 'gallery');
		const entries = await fs.readdir(galleryDir, { withFileTypes: true });
		
		const projects: GalleryEntry[] = [];
		for (const entry of entries) {
			if (entry.isDirectory()) {
				const projectPath = path.join(galleryDir, entry.name);
				const files = await fs.readdir(projectPath);
				const iterations = files
					.filter(f => f.endsWith('.js'))
					.sort();
				
				projects.push({
					projectName: entry.name,
					path: projectPath,
					iterations
				});
			}
		}
		
		return projects.sort((a, b) => b.projectName.localeCompare(a.projectName));
	} catch (err) {
		console.error('Gallery load error:', err);
		return [];
	}
}

// Color scheme
const COLORS = {
	primary: '#6366f1',
	success: '#22c55e',
	warning: '#f59e0b',
	error: '#ef4444',
	muted: '#6b7280',
	border: '#374151',
};

// Banner
const Banner = () => (
	<Box borderStyle="bold" borderColor={COLORS.primary} paddingX={1}>
		<Text bold color={COLORS.primary}>🎨 ATELIER TUI v1.0.0</Text>
		<Text color={COLORS.muted}> | Creative Coding Agent</Text>
	</Box>
);

// PromptInput
const PromptInput = ({ value, onChange, onSubmit, disabled }: {
	value: string;
	onChange: (v: string) => void;
	onSubmit: () => void;
	disabled?: boolean;
}) => {
	useInput((input, key) => {
		if (disabled) return;
		if (key.return) onSubmit();
		else if (key.backspace || key.delete) onChange(value.slice(0, -1));
		else if (input) onChange(value + input);
	});

	return (
		<Box flexDirection="column" borderStyle="round" borderColor={COLORS.border} paddingX={1}>
			<Text bold color="#9ca3af">Prompt</Text>
			<Text color={disabled ? COLORS.muted : '#f9fafb'}>
				{value || (disabled ? '[Processing...]' : 'Enter your creative prompt...')}
			</Text>
			{!disabled && <Text color={COLORS.muted} dimColor>ENTER to generate | ESC to clear</Text>}
		</Box>
	);
};

// PreviewPane
const PreviewPane = ({ projectName, iteration, code, isGenerating }: {
	projectName: string | null;
	iteration: number;
	code: string | null;
	isGenerating: boolean;
}) => (
	<Box flexDirection="column" borderStyle="round" borderColor={COLORS.border} paddingX={1} minHeight={15}>
		<Box>
			<Text bold color="#9ca3af">Preview</Text>
			<Text color={COLORS.muted}> | </Text>
			<Text color={COLORS.primary}>{projectName || 'No project'}</Text>
			{projectName && <><Text color={COLORS.muted}> v</Text><Text color={COLORS.success}>{iteration}</Text></>}
		</Box>
		<Box flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center">
			{isGenerating ? (
				<Text color={COLORS.warning} bold>Generating...</Text>
			) : code ? (
				<Box flexDirection="column">
					<Text color={COLORS.success}>✓ Code ready</Text>
					<Text color="#9ca3af" dimColor>{code.split('\n').slice(0, 5).join('\n')}{code.split('\n').length > 5 ? '\n...' : ''}</Text>
				</Box>
			) : (
				<Text color={COLORS.muted}>No preview available</Text>
			)}
		</Box>
	</Box>
);

// GalleryNav
const GalleryNav = ({ projects, currentIndex, onSelect }: {
	projects: GalleryEntry[];
	currentIndex: number;
	onSelect: (i: number) => void;
}) => {
	useInput((_, key) => {
		if (projects.length === 0) return;
		if (key.upArrow) onSelect(Math.max(0, currentIndex - 1));
		else if (key.downArrow) onSelect(Math.min(projects.length - 1, currentIndex + 1));
	});

	return (
		<Box flexDirection="column" borderStyle="round" borderColor={COLORS.border} paddingX={1} minHeight={10}>
			<Text bold color="#9ca3af">Gallery ({projects.length} projects)</Text>
			{projects.length === 0 ? (
				<Text color={COLORS.muted}>No projects yet</Text>
			) : (
				projects.slice(0, 8).map((project, index) => (
					<Box key={project.projectName}>
						<Text color={index === currentIndex ? COLORS.primary : COLORS.muted}>
							{index === currentIndex ? '▶ ' : '  '}
						</Text>
						<Text color={index === currentIndex ? '#f9fafb' : '#9ca3af'}>
							{project.projectName}
						</Text>
						<Text color={COLORS.muted} dimColor> ({project.iterations.length} iters)</Text>
					</Box>
				))
			)}
			<Text color={COLORS.muted} dimColor>↑↓ Navigate | ENTER Select</Text>
		</Box>
	);
};

// Controls
const Controls = ({ isGenerating, onGenerate, onStop, onExport, hasProject }: {
	isGenerating: boolean;
	onGenerate: () => void;
	onStop: () => void;
	onExport: () => void;
	hasProject: boolean;
}) => (
	<Box flexDirection="column" borderStyle="round" borderColor={COLORS.border} paddingX={1}>
		<Text bold color="#9ca3af">Controls</Text>
		<Box>
			<Text color={isGenerating ? COLORS.warning : COLORS.success}>
				{isGenerating ? '⏹ STOP' : '▶ GENERATE'}
			</Text>
			<Text color={COLORS.muted}> | </Text>
			<Text color={hasProject ? COLORS.primary : COLORS.muted}>📦 EXPORT</Text>
		</Box>
		<Text color={COLORS.muted} dimColor>{isGenerating ? 'Ctrl+C to cancel' : 'ENTER to start | E to export'}</Text>
	</Box>
);

// StatusBar
const StatusBar = ({ message, errors }: { message: string; errors: string[]; }) => (
	<Box flexDirection="column" borderStyle="single" borderColor={COLORS.border}>
		<Text color={COLORS.muted}>{message}</Text>
		{errors.map((err, i) => <Text key={i} color={COLORS.error}>{err}</Text>)}
	</Box>
);

// Main App
const App = ({ initialGallery }: { initialGallery: GalleryEntry[] }) => {
	const [prompt, setPrompt] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [currentProject, setCurrentProject] = useState<string | null>(null);
	const [currentIteration, setCurrentIteration] = useState(1);
	const [currentCode, setCurrentCode] = useState<string | null>(null);
	const [gallery] = useState<GalleryEntry[]>(initialGallery);
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [status, setStatus] = useState('Ready');
	const [errors, setErrors] = useState<string[]>([]);

	const handleGenerate = async () => {
		if (!prompt.trim() || isGenerating) return;
		setIsGenerating(true);
		setStatus('Generating...');
		setErrors([]);
		
		try {
			const { run } = await import('../dist/index.js');
			const result = await run(prompt, { maxIterations: 10, timeoutMinutes: 5, galleryDir: 'gallery' });
			setCurrentProject(result.project || prompt.slice(0, 30));
			setCurrentIteration(result.iterations);
			setCurrentCode(result.code);
			setStatus(`Complete: ${result.iterations} iterations, score: ${result.finalScore.toFixed(2)}`);
		} catch (err) {
			setErrors(prev => [...prev, `Generation failed: ${err}`]);
			setStatus('Generation failed');
		} finally {
			setIsGenerating(false);
		}
	};

	const handleStop = () => {
		if (isGenerating) { setIsGenerating(false); setStatus('Stopped'); }
	};

	const handleExport = async () => {
		if (!currentProject) return;
		try {
			const projectDir = path.join(PROJECT_ROOT, 'gallery', currentProject);
			const outputDir = path.join(PROJECT_ROOT, 'output');
			await fs.mkdir(outputDir, { recursive: true });
			const files = await fs.readdir(projectDir);
			const latestFile = files.filter(f => f.endsWith('.js')).sort().pop();
			if (latestFile) {
				const code = await fs.readFile(path.join(projectDir, latestFile), 'utf-8');
				await fs.writeFile(path.join(outputDir, `${currentProject}-export.js`), code);
				setStatus(`Exported to output/${currentProject}-export.js`);
			}
		} catch (err) { setErrors(prev => [...prev, `Export failed: ${err}`]); }
	};

	const handleGallerySelect = async (index: number) => {
		setGalleryIndex(index);
		const project = gallery[index];
		if (project) {
			setCurrentProject(project.projectName);
			setCurrentIteration(project.iterations.length);
			const latestFile = project.iterations[project.iterations.length - 1];
			if (latestFile) {
				const code = await fs.readFile(path.join(project.path, latestFile), 'utf-8');
				setCurrentCode(code);
			}
		}
	};

	useInput((input, key) => {
		if (key.escape) setPrompt('');
		if (input.toLowerCase() === 'e' && !isGenerating) handleExport();
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Banner />
			<Box flexDirection="row" marginY={1} gap={1}>
				<Box flexDirection="column" flexGrow={1} gap={1}>
					<PromptInput value={prompt} onChange={setPrompt} onSubmit={handleGenerate} disabled={isGenerating} />
					<PreviewPane projectName={currentProject} iteration={currentIteration} code={currentCode} isGenerating={isGenerating} />
				</Box>
				<Box flexDirection="column" width={30} gap={1}>
					<GalleryNav projects={gallery} currentIndex={galleryIndex} onSelect={handleGallerySelect} />
					<Controls isGenerating={isGenerating} onGenerate={handleGenerate} onStop={handleStop} onExport={handleExport} hasProject={!!currentProject} />
				</Box>
			</Box>
			<StatusBar message={status} errors={errors} />
		</Box>
	);
};

// Preload gallery and render
const gallery = await loadGallerySync();
render(<App initialGallery={gallery} />);
