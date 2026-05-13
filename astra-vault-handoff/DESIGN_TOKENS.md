# ASTRA VAULT — DESIGN TOKENS
## Extracted from v5 prototype — use these exact values

---

## COLOR SYSTEM

### Backgrounds
```
app-bg:          #02030b    (near-black with blue undertone)
card-bg:         rgba(255,255,255, 0.02)
card-bg-hover:   rgba(255,255,255, 0.04)
card-border:     rgba(255,255,255, 0.04)
header-bg:       rgba(2,3,11, 0.85)
nav-bg:          rgba(2,3,11, 0.90)
modal-overlay:   rgba(0,0,0, 0.70)
```

### Text
```
text-primary:    #E8ECF4
text-secondary:  #E0E6F0
text-muted:      rgba(200,210,225, 0.7)
text-dim:        rgba(180,195,220, 0.5)
text-ghost:      rgba(160,180,210, 0.4)
text-whisper:    rgba(160,180,210, 0.25)
label-text:      rgba(160,180,210, 0.5)   (with letterSpacing: 2, uppercase)
```

### Accent Colors
```
blue-primary:    #60A5FA    (main interactive, nav active, links)
blue-glow:       rgba(96,165,250, 0.4)
purple-primary:  #C084FC    (epic rarity, secondary accent)
purple-glow:     rgba(192,132,252, 0.35)
gold-primary:    #FBBF24    (ATP, legendary, rewards, trending)
gold-glow:       rgba(251,191,36, 0.4)
green-primary:   #4ADE80    (success, collected, complete, active status)
green-glow:      rgba(74,222,128, 0.3)
red-primary:     #FF4444    (error, wrong answer, stop)
red-soft:        #FF6B6B    (citizen science path)
orange-primary:  #FF8844    (meteor, planets path, streaks)
pi-purple:       #A78BFA    (Pi Network branding)
pi-blue:         #3B82F6    (Pi Network secondary)
```

### Rarity System
```
common:
  color:   #8B9BB4
  glow:    rgba(139,155,180, 0.25)
  bg:      rgba(139,155,180, 0.06)

uncommon:
  color:   #4ADE80
  glow:    rgba(74,222,128, 0.25)
  bg:      rgba(74,222,128, 0.06)

rare:
  color:   #60A5FA
  glow:    rgba(96,165,250, 0.30)
  bg:      rgba(96,165,250, 0.07)

epic:
  color:   #C084FC
  glow:    rgba(192,132,252, 0.35)
  bg:      rgba(192,132,252, 0.07)

legendary:
  color:   #FBBF24
  glow:    rgba(251,191,36, 0.40)
  bg:      rgba(251,191,36, 0.08)
```

### Star Colors (from real spectral data)
```
sirius:      #A8C8FF    (A-type, blue-white)
betelgeuse:  #FF6B4A    (M-type, red)
vega:        #C8DBFF    (A-type, blue-white)
rigel:       #B4D4FF    (B-type, blue)
arcturus:    #FFB86B    (K-type, orange)
polaris:     #FFF4D4    (F-type, yellow-white)
antares:     #FF4444    (M-type, deep red)
deneb:       #E8F0FF    (A-type, white)
aldebaran:   #FF9E5E    (K-type, orange)
eta_carinae: #FFD700    (LBV, gold)
```

---

## TYPOGRAPHY

### Font Stack
```
headings:     'Playfair Display', Georgia, serif     (weights: 400, 700, 900)
body-serif:   'Crimson Pro', Georgia, serif           (weights: 400, 600; italic: 400)
mono:         'DM Mono', monospace                    (weights: 300, 400, 500)
```

### Font Import
```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700;900&display=swap');
```

### Usage
```
App title (header):     DM Mono, 12-14px, 700, letterSpacing: 4, gradient text
Section headers:        Playfair Display, 20-24px, 700
Object names:           Playfair Display, 12-22px, 700
Body text:              Crimson Pro, 12-13px, 400, lineHeight: 1.6-1.8
Lore/italic:            Crimson Pro, 12px, 400 italic
Labels:                 DM Mono, 9-10px, 400, letterSpacing: 2, uppercase
Data values:            DM Mono, 13-48px, 600-700
Button text:            DM Mono, 10-11px, 600-700, letterSpacing: 1
Tiny metadata:          DM Mono, 7-9px, 400
```

---

## SPACING & LAYOUT

```
page-padding:       14-18px horizontal, 14-16px vertical
card-padding:       14-18px
card-border-radius: 10-14px
card-gap:           8-12px
button-padding:     10px 14px (standard), 4px 10px (pill/filter)
button-radius:      8px (standard), 16-20px (pill/filter)
section-gap:        14-16px between cards
header-height:      ~44px
nav-height:         ~52px
min-touch-target:   44x44px
progress-bar-height: 3-5px
badge-pill-padding: 2-3px 7px
badge-pill-radius:  10-16px
```

---

## ANIMATIONS

### Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-14px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 12px rgba(96,165,250, 0.08); }
  50% { box-shadow: 0 0 20px rgba(192,132,252, 0.15); }
}
```

### Usage
```
Page transitions:     fadeIn 0.2-0.5s ease
Toast notifications:  slideDown 0.2-0.25s ease, auto-dismiss 2200ms
Title shimmer:        shimmer 8s linear infinite (gradient text)
Status indicator:     pulse 2s infinite (green dot = live)
Logo glow:            glow 4s ease-in-out infinite
Progress bars:        width transition 0.4-0.6s ease
Card hover:           border-color + box-shadow transition 0.15-0.2s
```

### Shared Sky specific
```
Observers counter:    Number updates every 3 seconds with slight variance (±30)
Discovery feed:       Entries fade in opacity (1.0 → 0.4 top to bottom)
```

---

## COMPONENT PATTERNS

### Card
```
background: rgba(255,255,255, 0.02)
border: 1px solid rgba(255,255,255, 0.04)
borderRadius: 12px
padding: 14-16px
```

### Rarity-tinted card
```
border: 1px solid {rarity.color}12     (very faint tint)
hover border: {rarity.color}35
hover boxShadow: 0 0 15px {rarity.glow}
```

### Section label
```
fontSize: 9-10px
color: rgba(160,180,210, 0.4-0.5)
letterSpacing: 2
fontFamily: DM Mono
textTransform: uppercase
marginBottom: 8-10px
```

### ATP badge (header)
```
padding: 2px 7px
borderRadius: 10px
background: rgba(251,191,36, 0.05)
border: 1px solid rgba(251,191,36, 0.08)
fontSize: 10px
color: #FBBF24
fontWeight: 600
fontFamily: DM Mono
```

### Filter pill (inactive → active)
```
inactive:
  background: rgba(255,255,255, 0.02)
  color: rgba(160,180,210, 0.3-0.4)
  border: none

active:
  background: {accent}10 or rgba(255,255,255, 0.07)
  color: {accent} or #E8ECF4
  border: none
```

### Star glow (scanner rendering)
```
radialGradient: center → {star.color}35 → {star.color}0a → transparent
radius: baseRadius * 4
diffraction spikes: {star.color}20, lineWidth 0.6, length: baseRadius * 3
core: solid {star.color}, radius: max(2, (2 - magnitude) * 2)
collected ring: {rarity.color}50, dashed [3,3], radius: core + 7
```

---

## DARK MODE

This app is ALWAYS dark. There is no light mode. It's an astronomy app — light destroys dark adaptation. The entire palette is designed around the #02030b base.

All interactive overlays (modals, tooltips) use `backdropFilter: blur(12-16px)` for depth.

Scanner canvas clears to `rgba(2,3,10, 0.97)` — not pure black, slight blue warmth.

Star field background uses `rgba(2,3,11, 0.1)` fade for trail effect.
