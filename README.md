# LMC (Little Man Computer) Educational Game
![LMC Logo](./src/assets/title.gif "Little Man Computer")

Repository at: https://github.com/jh1662/LMC_simulator_game .

## Table of Contents
- [Play now](#play-now)
- [Download for Windows to play](#download-for-windows-to-play)
- [Regarding cloned commits (for developers and assaignment markers only)](#regarding-cloned-commits-for-developers-and-assaignment-markers-only)
  - [For all versions](#for-all-versions)
  - [Pre-sprint](#pre-sprint)
  - [For sprint-specific versions](#for-sprint-specific-versions)
  - [For the feedback implementation and offline porting (post-sprints) version](#for-the-feedback-implementation-and-offline-porting-post-sprints-version)

## Play Now
Online at: https://jh1662.github.io/LMC_simulator_game/ .

## Download for Windows to play
Download just the application file "LMC Sim Game.exe" from the repository (is in outermost directory).

## Regarding cloned commits (for developers and assaignment markers only)
Due to the large number of commits, the author urges the examiners to look at the versions in the submitted zip file instead of the repository.

### For all versions:
- use `npm install all` to install all dependencies and packages.
- use the "Live Server" or other VS extentions to easily open HTML files (otherwise just open them, from file explorer, with any browser).

### Pre-sprint
This one is just a starting point as a proof of concept to ensure project's start will go smoothly, such as TS (TypeScript) compilation via the `tsc` command.

### For sprint-specific versions:
- For the first sprint - Contains the backend simulator code *./src/code/vonNeumann.ts* which can be used with heurestic codes, such as *./src/tests/heuristicTesting.ts*. A proper CLI (Command Line Interface) was purposely not implemented to not deviate from plan for future sprints.
- For the second sprint - *./src/frames/simulator.html* is the main page to open with *./src/frames/manual.html* as the partially completed manual guide. *./src/frames/menu.html* is currently just a placeholder for proof of concept.
- For the third sprint - All pages are HTML files (except *test.html*) in *./src/frames/*. There is also *index.html*, in outermost directory, for the purpose of redirecting to *./src/frames/menu.html* as GitHub web-hosting always directs to *./index.html* first.

### For the feedback implementation and offline porting (post-sprints) version:
- There are two *package.json* files (online and offline versions), thus developer/examiner must do these commands to do install for both:
  - `npm install all` - installs the online ones.
  - `cd electron_app` - enters the offline port directory.
  - `npm install all` - installs the offline ones (only if `cd electron_app` was done first).
- To run the offline port use `npm run start`.
- To package the LMC Educational Simulator Game, into a Windows executable, use `npm run make` (may take a little while to do the packaging process). After completion, the executable file will be generated as *LMC Sim Game.exe* in directory path *./electron_app/out/make/squirrel.windows/x64/* .
- The latest online version is already hosted on GitHub at: https://jh1662.github.io/LMC_simulator_game/ .
- The offline (Windows executable) version is included in the zip file as *LMC Sim Game.exe* .