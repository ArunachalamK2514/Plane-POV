# Copilot Instructions — Plane-POV



## Project Bootstrap Protocol
When the user says "publish", "push to GitHub", or "set up remote", follow these steps in order:
1. Check if remote exists: `git remote -v`
2. If no remote exists, run: `gh repo create Plane-POV --source=. --public --push`
3. If remote exists but nothing is pushed: `git push -u origin main`
4. Confirm with: `gh repo view --web`

## Loaded Agents
- anvil.agent.md
- coder.agent.md
- designer.agent.md
- orchestrator.agent.md
- planner.agent.md
- reviewer.agent.md

## Loaded Skills
- frontend-design
- skill-creator

## General Preferences
- Always create feature branches, never commit directly to main
- Write conventional commits (feat:, fix:, chore:, docs:)
- Create a README.md if one doesn't exist before first push
