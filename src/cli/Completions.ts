export function generateCompletions(shell: string): string {
  const flags = "--prompt -p --max-iterations -m --output -o --provider --model --configure --recent --favorite --favorites --interactive -i --mode --use-swarm --swarm-mode --swarm-rounds --help -h --version";
  if (shell === "zsh") return "#compdef atelier\n# Flags: " + flags + "\n_atelier() { compdef _atelier atelier }";
  if (shell === "bash") return "# Flags: " + flags + "\n_atelier() { complete -F _atelier atelier }";
  return "";
}
