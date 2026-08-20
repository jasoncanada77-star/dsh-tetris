window.__ModuleLoader__.load({
	id: "dsh-tetris",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		//#region src/client/index.js
		/**
		* dsh-tetris — browser client half.
		*
		* A static Cordis client plugin (the standard installable-bundle form):
		*  - registers a "🎮 俄罗斯方块" entry in `sidebar.footer.action` (open button)
		*  - registers the full-screen game in `shell.overlay` (the frame-wide layer)
		*  - the game itself is a direct port of the dynamic-plugin version: Canvas +
		*    Web Audio + 7-bag + SRS kicks + hold + ghost + shared leaderboard.
		*
		* Built by tsdown into lib/client.js as a `window.__ModuleLoader__.load({id,
		* factory})` closure factory; 'react' resolves through the loader module table.
		*/
		let isOpen = false;
		const openListeners = /* @__PURE__ */ new Set();
		function setOpen(value) {
			isOpen = value;
			for (const listener of [...openListeners]) listener();
		}
		function subscribeOpen(listener) {
			openListeners.add(listener);
			return () => {
				openListeners.delete(listener);
			};
		}
		const CSS = `
  .tetris-plugin-root {
    position: fixed; inset: 0; z-index: 9999; overflow: auto;
    background: rgba(5, 5, 20, 0.94);
    display: flex; align-items: center; justify-content: center;
    pointer-events: auto; color: #e0e0e0; user-select: none;
    font-family: 'Segoe UI', 'PingFang SC', sans-serif;
  }
  .tetris-plugin-root * { margin: 0; padding: 0; box-sizing: border-box; }
  .tetris-plugin-root .tp-overlay-inner { position: relative; padding: 8px; }
  .tetris-plugin-root .tp-close-btn {
    position: absolute; top: -6px; right: -6px; z-index: 20;
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid #4444cc; background: #12122a; color: #fff;
    font-size: 14px; line-height: 1; cursor: pointer;
  }
  .tetris-plugin-root .tp-close-btn:hover { background: #6644ee; }
  .tetris-plugin-root .game-wrapper { display: flex; gap: 20px; align-items: flex-start; }
  .tetris-plugin-root .side-panel { width: 140px; display: flex; flex-direction: column; gap: 16px; }
  .tetris-plugin-root .panel-box {
    background: #12122a; border: 2px solid #2a2a4a;
    border-radius: 10px; padding: 12px; text-align: center;
  }
  .tetris-plugin-root .panel-box h3 {
    font-size: 13px; color: #8888bb; text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 8px;
  }
  .tetris-plugin-root .panel-box canvas { display: block; margin: 0 auto; }
  .tetris-plugin-root .panel-box .value {
    font-size: 22px; font-weight: bold; color: #fff;
    text-shadow: 0 0 10px rgba(100,100,255,0.5);
  }
  .tetris-plugin-root .board-container {
    position: relative; background: #0d0d20;
    border: 3px solid #2a2a5a; border-radius: 8px;
    padding: 4px; box-shadow: 0 0 30px rgba(50,50,150,0.2);
  }
  .tetris-plugin-root canvas.tp-board { display: block; border-radius: 4px; }
  .tetris-plugin-root .overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.75); display: flex; flex-direction: column;
    justify-content: center; align-items: center; border-radius: 6px; z-index: 10;
  }
  .tetris-plugin-root .overlay.hidden { display: none; }
  .tetris-plugin-root .overlay h1 { font-size: 32px; margin-bottom: 8px; color: #ff4466; }
  .tetris-plugin-root .overlay h2 { font-size: 26px; margin-bottom: 8px; color: #66bbff; }
  .tetris-plugin-root .overlay p { font-size: 15px; color: #aaa; margin-bottom: 16px; }
  .tetris-plugin-root .overlay .final-score { font-size: 20px; color: #ffcc44; margin-bottom: 16px; }
  .tetris-plugin-root .overlay .new-record {
    font-size: 16px; color: #ff6699; margin-bottom: 12px;
    animation: tp-pulse 0.8s ease-in-out infinite alternate;
  }
  @keyframes tp-pulse {
    from { opacity: 0.6; transform: scale(0.95); }
    to   { opacity: 1;   transform: scale(1.05); }
  }
  .tetris-plugin-root .highscore-value {
    font-size: 22px; font-weight: bold; color: #ffcc44;
    text-shadow: 0 0 10px rgba(255,200,50,0.4);
  }
  .tetris-plugin-root .btn {
    background: linear-gradient(135deg, #4444cc, #6644ee);
    color: #fff; border: none; padding: 12px 32px; font-size: 16px;
    border-radius: 8px; cursor: pointer; transition: transform 0.1s;
  }
  .tetris-plugin-root .btn:hover { transform: scale(1.05); }
  .tetris-plugin-root .btn:active { transform: scale(0.97); }
  .tetris-plugin-root .controls-info {
    margin-top: 16px; font-size: 12px; color: #555; line-height: 1.8;
  }
  .tetris-plugin-root .controls-info span { color: #7777aa; }
  .tetris-plugin-root .toggle-row {
    display: flex; align-items: center; justify-content: space-between; padding: 2px 0;
  }
  .tetris-plugin-root .toggle-row label { font-size: 13px; color: #8888bb; letter-spacing: 1px; }
  .tetris-plugin-root .toggle-switch { position: relative; width: 40px; height: 22px; cursor: pointer; }
  .tetris-plugin-root .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .tetris-plugin-root .toggle-slider {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: #2a2a4a; border-radius: 22px; transition: 0.25s;
  }
  .tetris-plugin-root .toggle-slider::before {
    content: ''; position: absolute; width: 16px; height: 16px;
    left: 3px; bottom: 3px; background: #666; border-radius: 50%; transition: 0.25s;
  }
  .tetris-plugin-root .toggle-switch input:checked + .toggle-slider { background: #4444cc; }
  .tetris-plugin-root .toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(18px); background: #fff;
  }
  .tetris-plugin-root .tp-subtitle {
    font-size: 13px; color: #8888bb; letter-spacing: 2px;
    margin-bottom: 12px; text-shadow: 0 0 8px rgba(100,100,255,0.35);
  }
  .tetris-plugin-root .tp-name-input {
    width: 100%; background: #0d0d20; border: 1px solid #2a2a4a;
    border-radius: 6px; color: #fff; padding: 4px 8px; font-size: 12px;
    margin-bottom: 6px; outline: none;
  }
  .tetris-plugin-root .tp-name-input:focus { border-color: #4444cc; }
  .tetris-plugin-root .tp-board-list { text-align: left; }
  .tetris-plugin-root .tp-board-empty {
    font-size: 11px; color: #555; padding: 4px 0; text-align: center;
  }
  .tetris-plugin-root .tp-board-row {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; padding: 2px 0; color: #8888bb;
  }
  .tetris-plugin-root .tp-board-rank { width: 22px; text-align: center; }
  .tetris-plugin-root .tp-board-name {
    flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .tetris-plugin-root .tp-board-score { color: #fff; font-weight: bold; }
  .tetris-plugin-root .tp-board-first .tp-board-score { color: #ffcc44; }
  .tp-open-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #4444cc, #6644ee);
    color: #fff; border: none; border-radius: 8px;
    padding: 6px 10px; font-size: 12px; cursor: pointer;
  }
  .tp-open-btn:hover { filter: brightness(1.15); }
`;
		function TetrisOpenButton() {
			return react.default.createElement("button", {
				className: "tp-open-btn",
				type: "button",
				onClick: () => setOpen(true),
				title: "打开俄罗斯方块"
			}, "🎮 俄罗斯方块");
		}
		function TetrisGame() {
			const [open, setOpenState] = react.default.useState(isOpen);
			react.default.useEffect(() => subscribeOpen(setOpenState), []);
			const boardRef = react.default.useRef(null);
			const holdRef = react.default.useRef(null);
			const nextRef = react.default.useRef(null);
			const scoreRef = react.default.useRef(null);
			const highScoreRef = react.default.useRef(null);
			const levelRef = react.default.useRef(null);
			const linesRef = react.default.useRef(null);
			const startOverlayRef = react.default.useRef(null);
			const gameOverOverlayRef = react.default.useRef(null);
			const pauseOverlayRef = react.default.useRef(null);
			const finalScoreRef = react.default.useRef(null);
			const newRecordRef = react.default.useRef(null);
			const ghostToggleRef = react.default.useRef(null);
			const soundToggleRef = react.default.useRef(null);
			const bgmToggleRef = react.default.useRef(null);
			const startBtnRef = react.default.useRef(null);
			const restartBtnRef = react.default.useRef(null);
			const boardListRef = react.default.useRef(null);
			const nameInputRef = react.default.useRef(null);
			const NAME_KEY = "tetris_player_name";
			function loadPlayerName() {
				try {
					return window.localStorage.getItem(NAME_KEY) || "";
				} catch (e) {
					return "";
				}
			}
			react.default.useEffect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-tetris";
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => {
					tag.remove();
				};
			}, []);
			react.default.useEffect(() => {
				const COLS = 10, ROWS = 20, BLOCK = 30;
				const COLORS = {
					I: "#00e5ff",
					O: "#ffdd00",
					T: "#aa44ff",
					S: "#44dd44",
					Z: "#ff4444",
					J: "#4488ff",
					L: "#ff8800"
				};
				const GHOST_ALPHA = .2;
				const SHAPES = {
					I: [
						[0, 0],
						[1, 0],
						[2, 0],
						[3, 0]
					],
					O: [
						[0, 0],
						[1, 0],
						[0, 1],
						[1, 1]
					],
					T: [
						[0, 0],
						[1, 0],
						[2, 0],
						[1, 1]
					],
					S: [
						[1, 0],
						[2, 0],
						[0, 1],
						[1, 1]
					],
					Z: [
						[0, 0],
						[1, 0],
						[1, 1],
						[2, 1]
					],
					J: [
						[0, 0],
						[0, 1],
						[1, 1],
						[2, 1]
					],
					L: [
						[2, 0],
						[0, 1],
						[1, 1],
						[2, 1]
					]
				};
				const KICKS = {
					normal: [
						[
							[0, 0],
							[-1, 0],
							[-1, -1],
							[0, 2],
							[-1, 2]
						],
						[
							[0, 0],
							[1, 0],
							[1, 1],
							[0, -2],
							[1, -2]
						],
						[
							[0, 0],
							[1, 0],
							[1, -1],
							[0, 2],
							[1, 2]
						],
						[
							[0, 0],
							[-1, 0],
							[-1, 1],
							[0, -2],
							[-1, -2]
						]
					],
					I: [
						[
							[0, 0],
							[-2, 0],
							[1, 0],
							[-2, 1],
							[1, -2]
						],
						[
							[0, 0],
							[2, 0],
							[-1, 0],
							[2, -1],
							[-1, 2]
						],
						[
							[0, 0],
							[-1, 0],
							[2, 0],
							[-1, -2],
							[2, 1]
						],
						[
							[0, 0],
							[1, 0],
							[-2, 0],
							[1, 2],
							[-2, -1]
						]
					]
				};
				const SCORE_TABLE = [
					0,
					100,
					300,
					500,
					800
				];
				const HS_KEY = "tetris_highscore";
				const BGM_SCHEDULE_AHEAD = .12;
				const BGM_TEMPO = .26;
				const LEADERBOARD = {
					readUrl: "https://kvdb.io/Xpm4Y6WXXuaEWMmLKQvFe3/board",
					writeUrl: "https://kvdb.io/Xpm4Y6WXXuaEWMmLKQvFe3/board",
					topCount: 8,
					maxStore: 15
				};
				const PENDING_KEY = "tetris_pending_scores";
				const G = {
					board: null,
					score: 0,
					level: 1,
					lines: 0,
					gameOver: false,
					paused: false,
					started: false,
					currentPiece: null,
					ghostY: 0,
					holdPiece: null,
					canHold: true,
					showGhost: true,
					soundEnabled: false,
					bgmEnabled: false,
					bag: [],
					nextPieces: [],
					dropInterval: 1e3,
					dropTimer: 0,
					lastTime: 0,
					lockTimer: 0,
					lockMoves: 0,
					highScore: 0,
					audioCtx: null,
					bgmPlaying: false,
					bgmSchedulerId: null,
					bgmMelodyIdx: 0,
					bgmBassIdx: 0,
					bgmNextMelodyTime: 0,
					bgmNextBassTime: 0,
					rafId: null,
					newRecordTimer: null,
					keys: {},
					repeatTimers: {},
					disposed: false
				};
				const canvas = boardRef.current;
				const ctx2d = canvas.getContext("2d");
				const holdCtx = holdRef.current.getContext("2d");
				const nextCtx = nextRef.current.getContext("2d");
				function loadHighScore() {
					try {
						G.highScore = parseInt(window.localStorage.getItem(HS_KEY)) || 0;
					} catch (e) {
						G.highScore = 0;
					}
					highScoreRef.current.textContent = Math.max(G.highScore, G.score || 0);
				}
				function saveHighScore() {
					if (G.score > G.highScore) {
						G.highScore = G.score;
						try {
							window.localStorage.setItem(HS_KEY, G.highScore);
						} catch (e) {}
						highScoreRef.current.textContent = G.highScore;
						return true;
					}
					return false;
				}
				function initAudio() {
					if (!G.audioCtx) G.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
					if (G.audioCtx.state === "suspended") G.audioCtx.resume();
				}
				function playTone(freq, duration, type, volume, delay) {
					if (!G.soundEnabled || !G.audioCtx) return;
					const t = G.audioCtx.currentTime + (delay || 0);
					const osc = G.audioCtx.createOscillator();
					const gain = G.audioCtx.createGain();
					osc.type = type || "square";
					osc.frequency.setValueAtTime(freq, t);
					gain.gain.setValueAtTime(volume == null ? .12 : volume, t);
					gain.gain.exponentialRampToValueAtTime(.001, t + duration);
					osc.connect(gain);
					gain.connect(G.audioCtx.destination);
					osc.start(t);
					osc.stop(t + duration);
				}
				function playNoise(duration, volume, delay) {
					if (!G.soundEnabled || !G.audioCtx) return;
					const t = G.audioCtx.currentTime + (delay || 0);
					const bufferSize = Math.floor(G.audioCtx.sampleRate * duration);
					const buffer = G.audioCtx.createBuffer(1, bufferSize, G.audioCtx.sampleRate);
					const data = buffer.getChannelData(0);
					for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
					const src = G.audioCtx.createBufferSource();
					src.buffer = buffer;
					const gain = G.audioCtx.createGain();
					gain.gain.setValueAtTime(volume == null ? .06 : volume, t);
					gain.gain.exponentialRampToValueAtTime(.001, t + duration);
					src.connect(gain);
					gain.connect(G.audioCtx.destination);
					src.start(t);
				}
				const SFX = {
					move() {
						playTone(300, .05, "square", .08);
					},
					rotate() {
						playTone(500, .08, "sine", .1);
					},
					softDrop() {
						playTone(200, .03, "square", .05);
					},
					hardDrop() {
						playNoise(.12, .15);
						playTone(150, .15, "sine", .12);
					},
					hold() {
						playTone(440, .06, "triangle", .1);
						playTone(550, .06, "triangle", .08, .06);
					},
					lock() {
						playTone(180, .08, "triangle", .08);
					},
					clear(n) {
						if (n === 4) {
							playTone(523, .12, "square", .12);
							playTone(659, .12, "square", .12, .08);
							playTone(784, .12, "square", .12, .16);
							playTone(1047, .25, "square", .14, .24);
						} else if (n === 3) {
							playTone(440, .1, "square", .11);
							playTone(554, .1, "square", .11, .08);
							playTone(659, .18, "square", .12, .16);
						} else if (n === 2) {
							playTone(440, .1, "square", .1);
							playTone(554, .15, "square", .11, .1);
						} else playTone(440, .12, "square", .1);
					},
					levelUp() {
						[
							523,
							659,
							784,
							1047
						].forEach((f, i) => playTone(f, .1, "sine", .12, i * .08));
					},
					gameOver() {
						[
							400,
							350,
							300,
							200
						].forEach((f, i) => playTone(f, .2, "sawtooth", .08, i * .15));
					},
					newRecord() {
						[
							523,
							659,
							784,
							988,
							1047
						].forEach((f, i) => playTone(f, .15, "sine", .14, i * .1));
					}
				};
				const BGM_MELODY = [
					[659, 2],
					[494, 1],
					[523, 1],
					[587, 1.5],
					[523, .5],
					[494, 1],
					[440, 2],
					[440, 1],
					[523, 1],
					[659, 1.5],
					[587, .5],
					[523, 1],
					[494, 2.5],
					[523, .5],
					[587, 1],
					[659, 2],
					[523, 2],
					[440, 2],
					[440, 2],
					[587, 2],
					[698, 1],
					[784, 1.5],
					[698, .5],
					[587, 1],
					[659, 2],
					[523, 2],
					[494, 1],
					[523, 1],
					[587, 1.5],
					[523, .5],
					[494, 1],
					[440, 2],
					[440, 1],
					[523, 1],
					[659, 1.5],
					[587, .5],
					[523, 1],
					[494, 2.5],
					[523, .5],
					[587, 1],
					[659, 2],
					[523, 2],
					[440, 2],
					[440, 2]
				];
				const BGM_BASS = [
					[165, 4],
					[165, 4],
					[110, 4],
					[110, 4],
					[147, 4],
					[147, 4],
					[165, 4],
					[165, 4],
					[147, 4],
					[147, 4],
					[131, 4],
					[131, 4],
					[110, 4],
					[110, 4],
					[110, 4],
					[110, 4]
				];
				function bgmScheduleNote(freq, time, duration, type, vol) {
					if (!G.audioCtx) return;
					const osc = G.audioCtx.createOscillator();
					const gain = G.audioCtx.createGain();
					osc.type = type;
					osc.frequency.setValueAtTime(freq, time);
					gain.gain.setValueAtTime(vol, time);
					gain.gain.setValueAtTime(vol * .8, time + duration * .7);
					gain.gain.exponentialRampToValueAtTime(.001, time + duration * .95);
					osc.connect(gain);
					gain.connect(G.audioCtx.destination);
					osc.start(time);
					osc.stop(time + duration);
				}
				function bgmScheduler() {
					if (!G.audioCtx || !G.bgmPlaying) return;
					while (G.bgmNextMelodyTime < G.audioCtx.currentTime + BGM_SCHEDULE_AHEAD) {
						const note = BGM_MELODY[G.bgmMelodyIdx % BGM_MELODY.length];
						const dur = note[1] * BGM_TEMPO;
						bgmScheduleNote(note[0], G.bgmNextMelodyTime, dur * .9, "square", .06);
						G.bgmNextMelodyTime += dur;
						G.bgmMelodyIdx++;
					}
					while (G.bgmNextBassTime < G.audioCtx.currentTime + BGM_SCHEDULE_AHEAD) {
						const note = BGM_BASS[G.bgmBassIdx % BGM_BASS.length];
						const dur = note[1] * BGM_TEMPO;
						bgmScheduleNote(note[0], G.bgmNextBassTime, dur * .85, "triangle", .05);
						G.bgmNextBassTime += dur;
						G.bgmBassIdx++;
					}
				}
				function startBGM() {
					if (!G.bgmEnabled || !G.audioCtx || G.bgmPlaying) return;
					G.bgmPlaying = true;
					G.bgmMelodyIdx = 0;
					G.bgmBassIdx = 0;
					G.bgmNextMelodyTime = G.audioCtx.currentTime + .05;
					G.bgmNextBassTime = G.audioCtx.currentTime + .05;
					G.bgmSchedulerId = setInterval(bgmScheduler, 25);
				}
				function stopBGM() {
					G.bgmPlaying = false;
					if (G.bgmSchedulerId) {
						clearInterval(G.bgmSchedulerId);
						G.bgmSchedulerId = null;
					}
				}
				function fillBag() {
					const types = [
						"I",
						"O",
						"T",
						"S",
						"Z",
						"J",
						"L"
					];
					for (let i = types.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						const tmp = types[i];
						types[i] = types[j];
						types[j] = tmp;
					}
					G.bag.push(...types);
				}
				function nextType() {
					if (G.bag.length < 7) fillBag();
					return G.bag.shift();
				}
				function ensureNext() {
					while (G.nextPieces.length < 4) G.nextPieces.push(nextType());
				}
				function createPiece(type) {
					return {
						type,
						cells: SHAPES[type].map((p) => [p[0], p[1]]),
						x: 3,
						y: 0,
						rotation: 0
					};
				}
				function rotateCells(cells, dir) {
					const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
					const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
					const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
					return cells.map((p) => {
						const dx = p[0] - cx, dy = p[1] - cy;
						return dir > 0 ? [Math.round(cx - dy), Math.round(cy + dx)] : [Math.round(cx + dy), Math.round(cy - dx)];
					});
				}
				function isValid(cells, ox, oy) {
					return cells.every((p) => {
						const nx = p[0] + ox, ny = p[1] + oy;
						return nx >= 0 && nx < COLS && ny < ROWS && (ny < 0 || !G.board[ny][nx]);
					});
				}
				function spawn() {
					ensureNext();
					const type = G.nextPieces.shift();
					ensureNext();
					G.currentPiece = createPiece(type);
					G.canHold = true;
					G.lockTimer = 0;
					G.lockMoves = 0;
					if (!isValid(G.currentPiece.cells, G.currentPiece.x, G.currentPiece.y)) {
						G.gameOver = true;
						showGameOver();
					}
					updateGhost();
					drawNext();
				}
				function updateGhost() {
					if (!G.currentPiece) return;
					G.ghostY = G.currentPiece.y;
					while (isValid(G.currentPiece.cells, G.currentPiece.x, G.ghostY + 1)) G.ghostY++;
				}
				function moveLeft() {
					if (isValid(G.currentPiece.cells, G.currentPiece.x - 1, G.currentPiece.y)) {
						G.currentPiece.x--;
						resetLock();
						updateGhost();
						SFX.move();
					}
				}
				function moveRight() {
					if (isValid(G.currentPiece.cells, G.currentPiece.x + 1, G.currentPiece.y)) {
						G.currentPiece.x++;
						resetLock();
						updateGhost();
						SFX.move();
					}
				}
				function moveDown() {
					if (isValid(G.currentPiece.cells, G.currentPiece.x, G.currentPiece.y + 1)) {
						G.currentPiece.y++;
						SFX.softDrop();
						return true;
					}
					return false;
				}
				function hardDrop() {
					let rows = 0;
					while (isValid(G.currentPiece.cells, G.currentPiece.x, G.currentPiece.y + 1)) {
						G.currentPiece.y++;
						rows++;
					}
					G.score += rows * 2;
					SFX.hardDrop();
					lockPiece();
				}
				function resetLock() {
					if (!isValid(G.currentPiece.cells, G.currentPiece.x, G.currentPiece.y + 1)) {
						G.lockMoves++;
						if (G.lockMoves < 15) G.lockTimer = 0;
					}
				}
				function rotate(dir) {
					if (G.currentPiece.type === "O") return;
					const newCells = rotateCells(G.currentPiece.cells, dir);
					const kickTable = G.currentPiece.type === "I" ? KICKS.I : KICKS.normal;
					const kickIdx = G.currentPiece.rotation;
					const kicks = dir > 0 ? kickTable[kickIdx] : kickTable[(kickIdx + 3) % 4].map((k) => [-k[0], -k[1]]);
					for (const kick of kicks) if (isValid(newCells, G.currentPiece.x + kick[0], G.currentPiece.y + kick[1])) {
						G.currentPiece.cells = newCells;
						G.currentPiece.x += kick[0];
						G.currentPiece.y += kick[1];
						G.currentPiece.rotation = (G.currentPiece.rotation + (dir > 0 ? 1 : 3)) % 4;
						resetLock();
						updateGhost();
						SFX.rotate();
						return;
					}
				}
				function lockPiece() {
					const { cells, x, y, type } = G.currentPiece;
					cells.forEach((p) => {
						const bx = p[0] + x, by = p[1] + y;
						if (by >= 0) G.board[by][bx] = type;
					});
					SFX.lock();
					clearLines();
					spawn();
				}
				function clearLines() {
					let cleared = 0;
					for (let r = 19; r >= 0; r--) if (G.board[r].every((c) => c)) {
						G.board.splice(r, 1);
						G.board.unshift(new Array(COLS).fill(null));
						cleared++;
						r++;
					}
					if (cleared > 0) {
						G.lines += cleared;
						G.score += SCORE_TABLE[cleared] * G.level;
						const newLevel = Math.floor(G.lines / 10) + 1;
						if (newLevel > G.level) SFX.levelUp();
						G.level = newLevel;
						G.dropInterval = Math.max(50, 1e3 - (G.level - 1) * 80);
						SFX.clear(cleared);
						updateUI();
					}
				}
				function doHold() {
					if (!G.canHold) return;
					G.canHold = false;
					const type = G.currentPiece.type;
					SFX.hold();
					if (G.holdPiece) {
						const tmp = G.holdPiece;
						G.holdPiece = type;
						G.currentPiece = createPiece(tmp);
					} else {
						G.holdPiece = type;
						spawn();
					}
					G.lockTimer = 0;
					G.lockMoves = 0;
					updateGhost();
					drawHold();
				}
				function drawBlock(context, x, y, color, size, alpha) {
					const px = x * size, py = y * size;
					context.globalAlpha = alpha == null ? 1 : alpha;
					context.fillStyle = color;
					context.fillRect(px + 1, py + 1, size - 2, size - 2);
					context.fillStyle = "rgba(255,255,255,0.25)";
					context.fillRect(px + 1, py + 1, size - 2, 4);
					context.fillRect(px + 1, py + 1, 4, size - 2);
					context.fillStyle = "rgba(0,0,0,0.25)";
					context.fillRect(px + size - 4, py + 1, 3, size - 2);
					context.fillRect(px + 1, py + size - 4, size - 2, 3);
					context.globalAlpha = 1;
				}
				function drawBoard() {
					ctx2d.clearRect(0, 0, canvas.width, canvas.height);
					ctx2d.strokeStyle = "rgba(255,255,255,0.04)";
					ctx2d.lineWidth = 1;
					for (let c = 1; c < COLS; c++) {
						ctx2d.beginPath();
						ctx2d.moveTo(c * BLOCK, 0);
						ctx2d.lineTo(c * BLOCK, canvas.height);
						ctx2d.stroke();
					}
					for (let r = 1; r < ROWS; r++) {
						ctx2d.beginPath();
						ctx2d.moveTo(0, r * BLOCK);
						ctx2d.lineTo(canvas.width, r * BLOCK);
						ctx2d.stroke();
					}
					for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (G.board[r][c]) drawBlock(ctx2d, c, r, COLORS[G.board[r][c]], BLOCK);
					if (G.currentPiece && !G.gameOver) {
						if (G.showGhost) G.currentPiece.cells.forEach((p) => {
							const gy = p[1] + G.ghostY, gx = p[0] + G.currentPiece.x;
							if (gy >= 0) drawBlock(ctx2d, gx, gy, COLORS[G.currentPiece.type], BLOCK, GHOST_ALPHA);
						});
						G.currentPiece.cells.forEach((p) => {
							const py = p[1] + G.currentPiece.y, px = p[0] + G.currentPiece.x;
							if (py >= 0) drawBlock(ctx2d, px, py, COLORS[G.currentPiece.type], BLOCK);
						});
					}
				}
				function drawMiniPiece(context, type, canvasW, canvasH, size) {
					const cells = SHAPES[type];
					const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
					const w = (Math.max(...xs) - Math.min(...xs) + 1) * size;
					const h = (Math.max(...ys) - Math.min(...ys) + 1) * size;
					const ox = (canvasW - w) / 2 / size - Math.min(...xs);
					const oy = (canvasH - h) / 2 / size - Math.min(...ys);
					cells.forEach((p) => drawBlock(context, p[0] + ox, p[1] + oy, COLORS[type], size));
				}
				function drawHold() {
					holdCtx.clearRect(0, 0, holdRef.current.width, holdRef.current.height);
					if (G.holdPiece) {
						const alpha = G.canHold ? 1 : .3;
						holdCtx.globalAlpha = alpha;
						drawMiniPiece(holdCtx, G.holdPiece, holdRef.current.width, holdRef.current.height, 20);
						holdCtx.globalAlpha = 1;
					}
				}
				function drawNext() {
					nextCtx.clearRect(0, 0, nextRef.current.width, nextRef.current.height);
					G.nextPieces.slice(0, 3).forEach((type, i) => {
						const cells = SHAPES[type];
						const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
						const size = 20;
						const w = (Math.max(...xs) - Math.min(...xs) + 1) * size;
						(Math.max(...ys) - Math.min(...ys) + 1) * size;
						const ox = (nextRef.current.width - w) / 2 / size - Math.min(...xs);
						const oy = i * 90 / size + .5;
						cells.forEach((p) => drawBlock(nextCtx, p[0] + ox, p[1] + oy, COLORS[type], size));
					});
				}
				function updateUI() {
					scoreRef.current.textContent = G.score;
					levelRef.current.textContent = G.level;
					linesRef.current.textContent = G.lines;
					highScoreRef.current.textContent = Math.max(G.highScore, G.score);
				}
				function loadPending() {
					try {
						return JSON.parse(window.localStorage.getItem(PENDING_KEY)) || [];
					} catch (e) {
						return [];
					}
				}
				function savePending(list) {
					try {
						window.localStorage.setItem(PENDING_KEY, JSON.stringify(list));
					} catch (e) {}
				}
				function renderBoard(list) {
					const el = boardListRef.current;
					if (el === null) return;
					el.textContent = "";
					if (!Array.isArray(list) || list.length === 0) {
						const div = document.createElement("div");
						div.className = "tp-board-empty";
						div.textContent = list === null ? "排行榜离线，本局分数已存本地" : "暂无记录，快来当第一！";
						el.appendChild(div);
						return;
					}
					list.slice(0, LEADERBOARD.topCount).forEach((item, i) => {
						const row = document.createElement("div");
						row.className = "tp-board-row" + (i === 0 ? " tp-board-first" : "");
						const rank = document.createElement("span");
						rank.className = "tp-board-rank";
						rank.textContent = [
							"🥇",
							"🥈",
							"🥉"
						][i] || String(i + 1);
						const nm = document.createElement("span");
						nm.className = "tp-board-name";
						nm.textContent = String(item && item.name || "玩家");
						const sc = document.createElement("span");
						sc.className = "tp-board-score";
						sc.textContent = String(item && item.score != null ? item.score : 0);
						row.appendChild(rank);
						row.appendChild(nm);
						row.appendChild(sc);
						el.appendChild(row);
					});
				}
				function writeBoard(list) {
					return window.fetch(LEADERBOARD.writeUrl, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(list)
					}).then((res) => {
						if (res.ok) return res;
						if (res.status === 404) return window.fetch(LEADERBOARD.writeUrl, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(list)
						});
						return res;
					});
				}
				function refreshBoard() {
					window.fetch(LEADERBOARD.readUrl).then((res) => res.ok ? res.json() : null).catch(() => null).then((raw) => {
						if (G.disposed) return;
						let list = Array.isArray(raw) ? raw : null;
						if (list !== null) {
							const pending = loadPending();
							if (pending.length > 0) {
								list = [...list, ...pending].sort((a, b) => b.score - a.score || a.ts - b.ts).slice(0, LEADERBOARD.maxStore);
								savePending([]);
								writeBoard(list).catch(() => {});
							}
						}
						renderBoard(list);
					});
				}
				function submitScore() {
					if (G.score <= 0) return;
					let name = nameInputRef.current ? nameInputRef.current.value.trim() : "";
					if (!name) name = "玩家";
					name = name.slice(0, 12);
					try {
						window.localStorage.setItem(NAME_KEY, name);
					} catch (e) {}
					const entry = {
						name,
						score: G.score,
						ts: Date.now()
					};
					window.fetch(LEADERBOARD.readUrl).then((res) => res.ok ? res.json() : []).catch(() => null).then((current) => {
						if (G.disposed) return null;
						if (current === null) {
							const pending = loadPending();
							pending.push(entry);
							savePending(pending.slice(-10));
							refreshBoard();
							return null;
						}
						const list = (Array.isArray(current) ? current : []).concat(entry);
						list.sort((a, b) => b.score - a.score || a.ts - b.ts);
						return writeBoard(list.slice(0, LEADERBOARD.maxStore)).then((res) => {
							if (!res.ok) {
								const pending = loadPending();
								pending.push(entry);
								savePending(pending.slice(-10));
							}
							return refreshBoard();
						});
					}).catch(() => {});
				}
				function showGameOver() {
					stopBGM();
					SFX.gameOver();
					const isNewRecord = saveHighScore();
					if (isNewRecord) G.newRecordTimer = setTimeout(() => SFX.newRecord(), 600);
					finalScoreRef.current.textContent = "最终分数: " + G.score;
					newRecordRef.current.classList.toggle("hidden", !isNewRecord);
					gameOverOverlayRef.current.classList.remove("hidden");
					submitScore();
				}
				function gameLoop(time) {
					if (!G.started) return;
					if (!G.lastTime) G.lastTime = time;
					const dt = time - G.lastTime;
					G.lastTime = time;
					if (!G.paused && !G.gameOver) {
						G.dropTimer += dt;
						if (!isValid(G.currentPiece.cells, G.currentPiece.x, G.currentPiece.y + 1)) {
							G.lockTimer += dt;
							if (G.lockTimer >= 500) {
								lockPiece();
								G.lockTimer = 0;
							}
						} else G.lockTimer = 0;
						if (G.dropTimer >= G.dropInterval) {
							G.dropTimer = 0;
							moveDown();
							updateUI();
						}
						drawBoard();
					}
					G.rafId = window.requestAnimationFrame(gameLoop);
				}
				function initGame() {
					G.board = Array.from({ length: ROWS }, () => new Array(COLS).fill(null));
					G.score = 0;
					G.level = 1;
					G.lines = 0;
					G.gameOver = false;
					G.paused = false;
					G.bag = [];
					G.nextPieces = [];
					G.holdPiece = null;
					G.canHold = true;
					G.dropInterval = 1e3;
					G.dropTimer = 0;
					G.lastTime = 0;
					G.lockTimer = 0;
					G.lockMoves = 0;
					loadHighScore();
					refreshBoard();
					updateUI();
					drawHold();
					ensureNext();
					spawn();
					drawBoard();
				}
				const REPEAT_KEYS = [
					"ArrowLeft",
					"ArrowRight",
					"ArrowDown"
				];
				function isEditableTarget(t) {
					if (!t) return false;
					if (t.isContentEditable) return true;
					const tag = t.tagName;
					return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
				}
				function onKeyDown(e) {
					if (isEditableTarget(e.target)) return;
					if (!G.started || G.gameOver) return;
					if (e.code === "KeyP" || e.code === "Escape") {
						G.paused = !G.paused;
						pauseOverlayRef.current.classList.toggle("hidden", !G.paused);
						if (G.paused) stopBGM();
						else startBGM();
						return;
					}
					if (G.paused) return;
					if (e.code === "KeyG") {
						G.showGhost = !G.showGhost;
						ghostToggleRef.current.checked = G.showGhost;
						drawBoard();
						return;
					}
					if (e.code === "KeyM") {
						G.soundEnabled = !G.soundEnabled;
						soundToggleRef.current.checked = G.soundEnabled;
						return;
					}
					if (e.code === "KeyB") {
						G.bgmEnabled = !G.bgmEnabled;
						bgmToggleRef.current.checked = G.bgmEnabled;
						if (G.bgmEnabled) startBGM();
						else stopBGM();
						return;
					}
					switch (e.code) {
						case "ArrowLeft":
							moveLeft();
							e.preventDefault();
							break;
						case "ArrowRight":
							moveRight();
							e.preventDefault();
							break;
						case "ArrowDown":
							if (moveDown()) {
								G.score += 1;
								updateUI();
							}
							e.preventDefault();
							break;
						case "ArrowUp":
							rotate(1);
							e.preventDefault();
							break;
						case "KeyZ":
							rotate(-1);
							break;
						case "Space":
							hardDrop();
							e.preventDefault();
							break;
						case "KeyC":
						case "ShiftLeft":
						case "ShiftRight":
							doHold();
							break;
						default: return;
					}
					if (REPEAT_KEYS.includes(e.code) && !G.repeatTimers[e.code]) {
						G.keys[e.code] = true;
						G.repeatTimers[e.code] = setTimeout(function repeat() {
							if (G.keys[e.code]) {
								if (e.code === "ArrowLeft") moveLeft();
								else if (e.code === "ArrowRight") moveRight();
								else if (e.code === "ArrowDown") {
									if (moveDown()) {
										G.score += 1;
										updateUI();
									}
								}
								drawBoard();
								G.repeatTimers[e.code] = setTimeout(repeat, 50);
							}
						}, 170);
					}
					drawBoard();
				}
				function onKeyUp(e) {
					G.keys[e.code] = false;
					const id = G.repeatTimers[e.code];
					if (id) {
						clearTimeout(id);
						delete G.repeatTimers[e.code];
					}
				}
				document.addEventListener("keydown", onKeyDown);
				document.addEventListener("keyup", onKeyUp);
				const onGhostChange = (e) => {
					G.showGhost = e.target.checked;
					if (G.started && !G.gameOver) drawBoard();
				};
				const onSoundChange = (e) => {
					G.soundEnabled = e.target.checked;
				};
				const onBgmChange = (e) => {
					G.bgmEnabled = e.target.checked;
					if (G.bgmEnabled && G.started && !G.gameOver && !G.paused) startBGM();
					else stopBGM();
				};
				const onNameChange = () => {
					if (nameInputRef.current) try {
						window.localStorage.setItem(NAME_KEY, nameInputRef.current.value.trim());
					} catch (e) {}
				};
				ghostToggleRef.current.addEventListener("change", onGhostChange);
				soundToggleRef.current.addEventListener("change", onSoundChange);
				bgmToggleRef.current.addEventListener("change", onBgmChange);
				nameInputRef.current.addEventListener("change", onNameChange);
				const onStart = () => {
					initAudio();
					G.started = true;
					startOverlayRef.current.classList.add("hidden");
					initGame();
					startBGM();
					G.lastTime = 0;
					G.rafId = window.requestAnimationFrame(gameLoop);
				};
				const onRestart = () => {
					initAudio();
					gameOverOverlayRef.current.classList.add("hidden");
					initGame();
					startBGM();
					G.lastTime = 0;
					G.rafId = window.requestAnimationFrame(gameLoop);
				};
				startBtnRef.current.addEventListener("click", onStart);
				restartBtnRef.current.addEventListener("click", onRestart);
				loadHighScore();
				return () => {
					G.disposed = true;
					if (G.rafId) window.cancelAnimationFrame(G.rafId);
					stopBGM();
					for (const code in G.repeatTimers) if (G.repeatTimers[code]) clearTimeout(G.repeatTimers[code]);
					G.repeatTimers = {};
					if (G.newRecordTimer) clearTimeout(G.newRecordTimer);
					document.removeEventListener("keydown", onKeyDown);
					document.removeEventListener("keyup", onKeyUp);
					ghostToggleRef.current.removeEventListener("change", onGhostChange);
					soundToggleRef.current.removeEventListener("change", onSoundChange);
					bgmToggleRef.current.removeEventListener("change", onBgmChange);
					nameInputRef.current.removeEventListener("change", onNameChange);
					startBtnRef.current.removeEventListener("click", onStart);
					restartBtnRef.current.removeEventListener("click", onRestart);
					if (G.audioCtx && typeof G.audioCtx.close === "function") try {
						G.audioCtx.close();
					} catch (e) {}
					G.audioCtx = null;
				};
			}, []);
			const box = (title, content) => react.default.createElement("div", { className: "panel-box" }, title == null ? null : react.default.createElement("h3", null, title), content);
			const toggleRow = (label, inputRef, defaultOn) => react.default.createElement("div", { className: "toggle-row" }, react.default.createElement("label", null, label), react.default.createElement("label", { className: "toggle-switch" }, react.default.createElement("input", {
				ref: inputRef,
				type: "checkbox",
				defaultChecked: defaultOn !== false
			}), react.default.createElement("span", { className: "toggle-slider" })));
			const hint = (text) => react.default.createElement("span", null, text);
			return react.default.createElement("div", {
				className: "tetris-plugin-root",
				style: open ? null : { display: "none" }
			}, react.default.createElement("div", { className: "tp-overlay-inner" }, react.default.createElement("button", {
				className: "tp-close-btn",
				type: "button",
				onClick: () => setOpen(false),
				title: "关闭"
			}, "✕"), react.default.createElement("div", { className: "game-wrapper" }, react.default.createElement("div", { className: "side-panel" }, box("保留", react.default.createElement("canvas", {
				ref: holdRef,
				width: 100,
				height: 80
			})), box("分数", react.default.createElement("div", {
				ref: scoreRef,
				className: "value"
			}, "0")), box("最高分", react.default.createElement("div", {
				ref: highScoreRef,
				className: "highscore-value"
			}, "0")), box("等级", react.default.createElement("div", {
				ref: levelRef,
				className: "value"
			}, "1")), box("行数", react.default.createElement("div", {
				ref: linesRef,
				className: "value"
			}, "0"))), react.default.createElement("div", { className: "board-container" }, react.default.createElement("canvas", {
				ref: boardRef,
				className: "tp-board",
				width: 300,
				height: 600
			}), react.default.createElement("div", {
				ref: startOverlayRef,
				className: "overlay"
			}, react.default.createElement("h2", null, "俄罗斯方块"), react.default.createElement("div", { className: "tp-subtitle" }, "AI干活~我摸鱼！"), react.default.createElement("p", null, "经典方块消除游戏"), react.default.createElement("button", {
				ref: startBtnRef,
				className: "btn",
				type: "button"
			}, "开始游戏"), react.default.createElement("div", { className: "controls-info" }, hint("←→"), " 移动  ", hint("↑"), " 旋转  ", hint("↓"), " 加速", react.default.createElement("br", null), hint("空格"), " 硬降  ", hint("C"), " 保留  ", hint("P/Esc"), " 暂停", react.default.createElement("br", null), hint("G"), " 幽灵 开/关  ", hint("M"), " 音效 开/关", react.default.createElement("br", null), hint("B"), " BGM 开/关")), react.default.createElement("div", {
				ref: gameOverOverlayRef,
				className: "overlay hidden"
			}, react.default.createElement("h1", null, "游戏结束"), react.default.createElement("div", {
				ref: newRecordRef,
				className: "new-record hidden"
			}, "新纪录!"), react.default.createElement("div", {
				ref: finalScoreRef,
				className: "final-score"
			}, "分数: 0"), react.default.createElement("button", {
				ref: restartBtnRef,
				className: "btn",
				type: "button"
			}, "再来一局")), react.default.createElement("div", {
				ref: pauseOverlayRef,
				className: "overlay hidden"
			}, react.default.createElement("h2", null, "暂停"), react.default.createElement("p", null, "按 P 或 Esc 继续游戏"))), react.default.createElement("div", { className: "side-panel" }, box("下一个", react.default.createElement("canvas", {
				ref: nextRef,
				width: 100,
				height: 280
			})), box(null, toggleRow("幽灵", ghostToggleRef, true)), box(null, toggleRow("音效", soundToggleRef, false)), box(null, toggleRow("BGM", bgmToggleRef, false)), box("排行榜", react.default.createElement("input", {
				ref: nameInputRef,
				className: "tp-name-input",
				type: "text",
				maxLength: 12,
				defaultValue: loadPlayerName(),
				placeholder: "输入昵称上榜"
			}), react.default.createElement("div", {
				ref: boardListRef,
				className: "tp-board-list"
			}))))));
		}
		const inject = ["slots"];
		function apply(ctx) {
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "dsh-tetris-open",
				order: -1e3,
				label: "俄罗斯方块"
			}, () => react.default.createElement(TetrisOpenButton)));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-tetris-game"
			}, () => react.default.createElement(TetrisGame)));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map