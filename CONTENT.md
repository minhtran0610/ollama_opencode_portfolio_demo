# Content

This file is content only, no design/layout instructions here. The design
spec (colors, type, layout) is a separate file that references this one.

## Identity

- Name: Minh Tran
- Role: Machine Learning Engineer, Xweather Labs @ Vaisala Xweather
- Location: Espoo, Finland
- Email: minhtran0610@gmail.com
- Links: [GitHub](https://github.com/minhtran0610) ·
  [LinkedIn](https://www.linkedin.com/in/minhtran0610) ·
  [ORCID](https://orcid.org/0000-0003-4637-6081)
- Languages: Vietnamese (native), English (professional), Finnish (elementary)
- Photo: marathon finish-line shot, Tampere Maraton, medal on, peace sign,
  approved to replace a corporate headshot. Already in the repo at
  `public/images/minh.jpeg` (web path `/images/minh.jpeg`) — use this
  exact filename. Originally uploaded as
  `E64329BC-DD8C-432A-AD51-6A4624BD154B_1_105_c.jpeg` and renamed on
  import; that original filename is historical context only, not a
  filename to reference anywhere.

**One-line hook (locked, use verbatim):**
"I love being bossy to computers and have been doing so for a few years.
It turns out that computers are quite smart and (un)willing to learn, so
I study computer pedagogy."

## About

Machine Learning Engineer at Vaisala Xweather, currently working on point
weather forecasting with classical ML (XGBoost, SVR) after a year building
inference pipelines for transformer based precipitation models. Background
spans deep learning, 3D reconstruction, and privacy preserving audio ML,
with three published papers, a Gaussian splatting implementation, and a
recurring theme of picking things apart to see how they work.

Outside of work, builds and racks PCs, runs a home Proxmox cluster, and
would rather self host something than sign up for it. Into Lego for the
same reason: a taste for things that are well engineered and satisfying to
assemble, whether physical or digital.

There's a pattern underneath all of it: a preference for staying close to
the mechanism instead of behind a layer of abstraction, whether that's
self hosting a server instead of subscribing to one, or driving a small
car that lets him feel the road instead of a bigger one that insulates him
from it. Off the clock that shows up as time outdoors, sport, travel, and
a general habit of being the one who drives, not just for himself.

Believes the most interesting AI work right now doesn't need a
hyperscaler's GPU budget. It needs a consumer GPU, curiosity, and a
willingness to read the docs.

## Projects

Ordered by how well they represent "the vibe": DIY, self hosted,
technically real. Not chronological. Jarvis stays at #3 for now since it's
unfinished, even though it's technically the deepest entry here.

**Rendering note (locked, decided after review):** a quiet list, same
treatment as Experience — no cards, no grid, no thumbnail images inline.
For each item: title, then the Hook + What it does folded into one
description paragraph (the DIY spirit detail can fold in too if it's not
too long), then the CTA link, then the Stack as a small tag row —
**in that order, CTA before tags**, so the action sits right after the
pitch instead of behind a row of pills. Jarvis has no CTA link (its repo
stays unlinked — decided, don't add one) but does get a small "Paused"
tag next to its title. Home Lab has no Stack tag row and no inline
image; instead its CTA is "View photo →", which opens the rack photo in
a lightbox (click to open, click backdrop or × to close) rather than
showing it inline — see DESIGN.md's Lightbox component for the exact
zero-JS pattern.

### 1. World Cup 2026 Prediction Model
- **Hook:** A joint scoreline model that derives every betting market, 1X2,
  over/under, BTTS, correct score, Asian handicap, from one coherent
  probability grid instead of fitting each market separately.
- **What it does:** A neural net (`ScoreGridNet`) outputs Poisson rate
  parameters plus a Dixon Coles correlation term. Every market is a
  closed form sum over the resulting 8x8 score grid. Backed by team
  embeddings, a GRU form encoder over each team's last 10 matches, and a
  context MLP (rest days, neutral venue, squad quality, tournament stage).
- **The DIY spirit detail:** a locally hosted qwen3.5:9b model reads live
  news RSS feeds and extracts a structured "team form" signal, injuries,
  morale, tactical notes, which nudges the model's predictions. Runs end
  to end in Docker (scheduler, trainer, and Ollama services) with a
  Telegram bot firing predictions before kickoff, deployed on his own
  hardware.
- **Stack:** PyTorch, XGBoost/Dixon-Coles baselines, Docker Compose,
  Ollama, Telegram Bot API
- **Link:** https://github.com/minhtran0610/worldcup_prediction

### 2. Ollama Context-Window Demo
- **Hook:** What actually happens when you feed a local LLM more text than
  its context window can hold, using Finnish residence permit and company
  law as content people in the audience genuinely needed answers to.
- **What it does:** A live demo, built for the Vietnamese tech community in
  Finland, that empirically shows Ollama's real truncation behavior:
  overflowing the context budget doesn't quietly drop the excess, it
  silently truncates to roughly half the configured window with no
  warning. The demo proves this on real, unmodified Finnish statute
  translations, then shows the same question answered correctly once given
  enough context (32K fails, 128K succeeds), no bigger model required.
- **The DIY spirit detail:** entirely local, on a single consumer GPU (RTX
  4070 Ti Super, 16GB), real legal reasoning that would otherwise mean a
  cloud API call, running on hardware he owns.
- **Stack:** Ollama, Python (uv), qwen3.5 (9b/4b/2b/0.8b)
- **Link:** https://github.com/minhtran0610/ollama_law_demo

### 3. Jarvis, a self-hosted AI memory assistant (paused)
- **Hook:** A two-node, self hosted system that remembers everything you
  log from the terminal, then answers questions using full context pulled
  from your own history. No cloud dependency.
- **What it does:** A stateless "Thinker" node runs Ollama and only
  streams tokens, evicting the model from VRAM after every response so the
  GPU can be swapped or upgraded with a one line config change. A separate
  "Librarian" node holds all the state: a Qdrant vector store, a two-stage
  retrieval pipeline (BGE-M3 embedding search narrows to 50 candidates, a
  BGE-Reranker-v2-m3 cross-encoder narrows that to the best 5), and a
  FastAPI gateway the CLI talks to over Tailscale. Memory has a real
  lifecycle: entries start as raw "hot" logs, roll up into weekly "warm"
  summaries after 7 days, and get evicted after 90 days unless explicitly
  marked significant.
- **The DIY spirit detail:** a phase 2 roadmap, a third gateway node so
  friends can log in over HTTPS, was already designed before phase 1 was
  even finished. Paused, not abandoned: it ran on two standalone Fedora
  servers, and work is on hold while that hardware gets folded into the
  current three-node Proxmox cluster.
- **Stack:** Ollama, Qdrant, HuggingFace TEI (BGE-M3 embedding,
  BGE-Reranker-v2-m3), FastAPI, Typer CLI, Tailscale, Docker Compose
- **Link:** https://github.com/minhtran0610/jarvis (private, or make
  public before the talk)

### 4. Home Lab, a three-node Proxmox cluster
- **Hook:** Three PCs, each built for a specific job, stacked on a
  minimalist metal shelf next to a PS5 and a few Lego sets. Proof that a
  home lab can be fast and tidy at the same time.
- **What it does:** Node 1 (Ryzen 5 3600, headless, no GPU) handles
  management and dev work inside a small Jonsbo C6 case. Node 2 (Ryzen 5
  7600, dual GPU with an RTX 3070 and RTX 3060) runs local LLM inference,
  water cooled with a Thermalright Aqua Elite 240 inside an NZXT H5. Node 3
  (Intel i5 14600KF, RTX 4070 Ti Super) handles GPU training, air cooled
  with a Thermalright Phantom Spirit 120 Evo, currently being rebuilt into
  a Lian Li Dan B4 small form factor case. All three run Proxmox and are
  networked over Tailscale for remote access from anywhere.
- **The DIY spirit detail:** cable management and case choice get the same
  care as the hardware inside them. The rack sits on an IKEA BROR
  shelving unit next to a PS5 with a couple of controllers, a Lego
  Jaguar E-Type, and his girlfriend's Lego Hogwarts Castle and Winnie the
  Pooh sets. A good chunk of the actual time goes into researching parts
  and cooling, not just running the servers.
- **Stack:** Proxmox, ZFS, Tailscale, Ollama, CUDA passthrough
- **Link:** no repo, photos only for now. A written post about the build
  could follow later, but no need to force it before the talk.
- **Image:** already in the repo at `public/images/pc_rack.jpg` (web path
  `/images/pc_rack.jpg`) — use this exact filename in place of a link,
  per the design spec.


## Off the Clock

The same instinct that runs the home lab, staying close to the mechanism
instead of behind a layer of abstraction, shows up outside of tech too.

- Cars and driving: prefers something small enough to feel the road, and
  would rather drive someone himself than point them at a taxi app.
- Outdoors, sport, and travel: spends as much time away from the GPUs as
  the GPUs allow.

Render as a compact tag row (locked, don't re-derive): Driving, not
taxiing · Time outdoors · Sports · Travel

(This section would get sharper with specifics: name a sport, a car, or a
trip that actually mattered, and it'll fold in.)

## Experience (compressed, not a CV)

Render as a quiet vertical list, most recent first — 5 entries, all 5
render, none dropped for space. Each entry gets a short "Skills" tag row
(small pills) alongside the one-line description; tags below are locked,
don't re-derive them from the prose each time.

- **Machine Learning Engineer, Vaisala Xweather** (Feb 2026-present):
  point weather forecasting with classical ML (XGBoost, scikit-learn),
  contributing to long-term ML/AI prediction capability.
  Skills: XGBoost, scikit-learn, Classical ML
- **Junior Deep Learning Engineer, Vaisala Xweather** (Jun 2025-Feb
  2026): inference and visualization pipelines for a transformer-based,
  multi-head precipitation model. 20% inference latency reduction via
  PyTorch/TensorRT model compilation.
  Skills: PyTorch, TensorRT, Transformers
- **Thesis Worker, CIVIT (Tampere)** (Oct 2024-Dec 2025): implemented
  Gaussian splatting for a volumetric capture studio.
  Skills: Gaussian Splatting, 3D Reconstruction
- **Data Scientist, Kempower** (May 2023-Oct 2024): cloud based data
  science for EV charging infrastructure.
  Skills: Data Science, Cloud, EV Charging
- **Research Assistant, Tampere University** (2021-2023): Arrowhead/MQTT
  service integration (David Hästbacka); adversarial learning for
  privacy preserving audio representations (Tuomas Virtanen's Audio
  Research Group), the basis for 2 of the 3 papers below and the BSc
  thesis.
  Skills: MQTT, Adversarial Learning, Audio ML

## Education

- **M.Sc., Signal Processing & Machine Learning**, Tampere University
  (2023-2025). Thesis: *Automated Matting and Gaussian Splatting toward
  High-Fidelity Volumetric Performance Capture*
  ([link](https://urn.fi/URN:NBN:fi:tuni-2025122212070)), the formal
  writeup behind the CIVIT Gaussian splatting work listed under
  Experience.
- **B.Sc., Science and Engineering**, Tampere University (2020-2023).
  Thesis: *Learning privacy-preserving representation of audio data with
  adversarial learning*
  ([link](https://urn.fi/URN:NBN:fi:tuni-202304254453))
- Hanoi-Amsterdam High School for the Gifted (Chemistry), 2017-2020

## Publications

1. "External Token-Based Authorization of Data-Driven Integrations and
   Service Compositions in MQTT 5." *IECON 2023.*
   [doi:10.1109/IECON51785.2023.10311779](https://doi.org/10.1109/IECON51785.2023.10311779)
2. "Adversarial Representation Learning for Robust Privacy Preservation in
   Audio." *IEEE Open Journal of Signal Processing, 2024.*
   [doi:10.1109/OJSP.2023.3349113](https://doi.org/10.1109/OJSP.2023.3349113) ·
   [arXiv:2305.00011](https://arxiv.org/abs/2305.00011)
3. "Representation Learning for Audio Privacy Preservation Using Source
   Separation and Robust Adversarial Learning."
   [arXiv:2308.04960](https://arxiv.org/abs/2308.04960)

*(Author lists dropped for readability, all co-authored. Full citations
available at each link.)*

## Skills (LinkedIn top skills + inferred from projects)

CUDA, Transformers, Model Inference (TensorRT), PyTorch, XGBoost,
classical ML (SVR, Elo, Dixon-Coles), Docker, Ollama / local LLM
deployment, Proxmox / self-hosting

## Tone note for whoever writes final copy

Dry, understated humor throughout, matching the LinkedIn line. Avoid em
dashes as a punctuation habit, use periods, commas, or colons instead.