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
*LMC Sim Game.exe* can be downloaded from the Realeases: https://github.com/jh1662/LMC_simulator_game/releases .

If that is down, for whatever reason, or having other difficulties then you can get it from DropBox instead: https://www.dropbox.com/scl/fi/iu2z3n5sn6u9f3lz3qqvf/LMC-Sim-Game.exe?rlkey=pwy6vyi803mkaahwsrn76fjrk&st=2lqm81jp&dl=0 .

## Corrosponding project poster and dissertation
The graded corrosponding project poster and dissertation can be viewed in the root directory, as *[BSc Y3T1 Idv (final year poject) Poster.pdf](<BSc Y3T1 Idv (final year poject) Poster.pdf>)* and *[BSc Y3T2 Idv (final year poject) Dissertation.pdf](<BSc Y3T2 Idv (final year poject) Dissertation.pdf>)* respectfully.

## Regarding cloned commits (for developers and assignment markers/examiners only)
Due to the large number of commits, the author urges the markers/examiners to look at the versions in the submitted zip file instead of the repository.

### For all versions:
- Use `npm install all` to install all dependencies and packages.
- Use the "Live Server", or other VS extensions, to easily open HTML files. Otherwise, just open them, from file explorer, with any browser.

### Pre-sprint
This one is just a starting point as a proof of concept to ensure the project's start will go smoothly, such as TS (TypeScript) compilation via the `tsc` command.

### For sprint-specific versions:
- For the first sprint - Contains the backend simulator code *./src/code/vonNeumann.ts* which can be used with heuristic codes, such as *./src/tests/heuristicTesting.ts*. A proper CLI (Command Line Interface) was purposely not implemented to not deviate from plan for future sprints.
- for the second sprint - *./src/frames/simulator.html* is the main page to open with *./src/frames/manual.html* as the partially completed manual guide. *./src/frames/menu.html* is currently just a placeholder for proof of concept.
- for the third sprint - All pages are HTML files (except *test.html*) in *./src/frames/*. There is also *index.html*, in root directory, for the purpose of redirecting to *./src/frames/menu.html* as GitHub web-hosting always directs to *./index.html* first.

### For the feedback implementation and offline porting (post-sprints) version:
- There are two *package.json* files, online and offline versions, so developer/examiner must do these commands to do install for both:
  - `npm install all` - installs the online ones.
  - `cd electron_app` - enters the offline port directory.
  - `npm install all` - installs the offline ones (only if `cd electron_app` was done first).
- To run the offline port use `npm run start`.
- To package the LMC Educational Simulator Game, into a Windows executable, use `npm run make` (may take a little while to do the packaging process). After completion, the executable file will be generated as *LMC Sim Game.exe* in the generated directory path *./electron_app/out/make/squirrel.windows/x64/* .
- The latest online version is already hosted on GitHub at: https://jh1662.github.io/LMC_simulator_game/ .
- The offline (Windows executable) version is included in the zip file as *LMC Sim Game.exe* .