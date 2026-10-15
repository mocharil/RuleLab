# Brief: Generate 7 Illustrations for the RuleLab Demo Video

You are an illustrator. Please generate **all 7 images** described below, one at a time, in the order given. Follow the shared style, the character sheet and the rules exactly, so every image looks like part of one consistent set.

## Context

RuleLab is an AI workspace that helps the Indonesian government draft regulations and test their impact on citizens before they are signed. These images will go into a 3-minute product demo video for a hackathon.

The story: a draft regulation says *"applications may only be submitted through a digital app."* That rule locks out three citizens: an elderly woman, a wheelchair user, and a fisherman in a village with no signal. RuleLab catches the problem, and by the end of the video the same three people are being served through an assisted channel.

- Images **A1, B1, C1** show each citizen **locked out**.
- Images **A2, B2, C2** show the **same three people being served**.
- Image **D** shows an overwhelmed regulation drafter.

The video will place these images on a plain light-grey background next to large bold text and a minimal app interface. Calm, clean images work best; busy ones will not.

## Rules (apply to every image)

1. **Same style for all 7 images.** Use the style block below every time.
2. **Same characters across images.** A1 and A2 must clearly be the same person, and likewise B1/B2 and C1/C2. Follow the character sheet exactly (face, age, clothing, colors). When generating A2, B2 and C2, use A1, B1 and C1 as visual references.
3. **Background:** plain, flat light warm grey `#F2F2F3`, with no gradient, scenery edges or frame. Scene elements (bench, stairs, boat, desk) float on this plain background like a small diorama.
4. **No text anywhere:** no letters, numbers, signs, logos, flags or readable screens. Phone and tablet screens are blank glowing rectangles.
5. **Color:** a muted neutral palette with **one small crimson red accent (`#C8102E`)** per image, as described in each prompt.
6. **Composition:** subject centered with generous empty space around it, nothing important touching the edges.
7. **Respectful tone.** Dignified and warm, never pitiful, mocking or stereotyped.
8. **Sizes:** square **1024×1024** for A1, A2, B1, B2, C1, C2; landscape **1536×1024** for D.

### Style block (use in every image)

```
Soft 3D clay illustration, minimal and editorial, rounded friendly forms, matte materials,
soft diffused studio lighting, plain flat light warm-grey background (#F2F2F3), muted neutral palette
with a single small crimson red (#C8102E) accent, Indonesian people and setting, dignified and warm,
centered subject, generous empty space around subject, no text, no letters, no logos
```

### Avoid

```
text, letters, numbers, watermark, logo, flag, signage, readable screens, extra fingers, distorted face,
cluttered background, gradient background, harsh shadows, dark gloomy mood, photorealistic skin,
caricature, stereotype
```

## Character sheet (keep identical across images)

| Character | Appearance |
| :--- | :--- |
| **Ibu Sari** (A) | Indonesian woman, about 70, round kind face, small round reading glasses, soft beige hijab, maroon-and-cream batik blouse, dark brown long skirt |
| **Raka** (B) | Indonesian man, about 28, short black hair, light blue button shirt, grey trousers, dark grey manual wheelchair, carries a brown paper document folder |
| **Pak Darto** (C) | Indonesian fisherman, about 50, tanned skin, thin moustache, faded teal t-shirt, rolled-up khaki trousers, woven bamboo hat |
| **Service officers** | Young Indonesian staff in neat navy uniforms; the crimson accent is their lanyard |
| **Drafter** (D) | Indonesian civil servant, about 35, short black hair, thin glasses, navy-and-white batik shirt |

## Images to generate (in this order)

### 1. A1: Ibu Sari, locked out · 1024×1024 · `citizen-a-locked.png`

```
[STYLE BLOCK]. Ibu Sari (elderly Indonesian woman, about 70, round kind face, small round reading
glasses, soft beige hijab, maroon-and-cream batik blouse) sits on a simple wooden bench, holding a modern
smartphone at arm's length with a puzzled but patient expression. The phone screen is a blank glowing
rectangle. Half-body, eye-level, calm and respectful, a quiet sense of being left behind.
Crimson accent: a small crimson phone case.
```

### 2. A2: Ibu Sari, served · 1024×1024 · `citizen-a-served.png`

```
[STYLE BLOCK]. The same Ibu Sari as in A1 (same face, glasses, beige hijab, maroon-and-cream batik),
now smiling, seated at a friendly public service counter. A young female service officer in a navy
uniform sits across from her and helps her with a tablet, pointing gently at the blank screen.
Warm, relieved atmosphere. Half-body, eye-level. Crimson accent: the officer's lanyard.
```

### 3. B1: Raka, locked out · 1024×1024 · `citizen-b-locked.png`

```
[STYLE BLOCK]. Raka (Indonesian man, about 28, short black hair, light blue shirt, grey trousers,
dark grey manual wheelchair) stopped at the bottom of a short flight of five concrete stairs that lead
up to a small, simple government office door. He looks up at the stairs, a brown paper document folder
on his lap. Simple architecture, no signs. Full-body, three-quarter view, quiet frustration, dignified
posture. Crimson accent: the closed office door.
```

### 4. B2: Raka, served · 1024×1024 · `citizen-b-served.png`

```
[STYLE BLOCK]. The same Raka as in B1 (same face, light blue shirt, dark grey wheelchair, brown
folder), now smiling while rolling up a gentle ramp built beside the same five stairs into the same
small government office. A service officer in a navy uniform holds the now-open door and greets him.
Full-body, three-quarter view, a sense of welcome. Crimson accent: the open office door.
```

### 5. C1: Pak Darto, no signal · 1024×1024 · `citizen-c-locked.png`

```
[STYLE BLOCK]. Pak Darto (Indonesian fisherman, about 50, tanned, thin moustache, faded teal t-shirt,
rolled-up khaki trousers, woven bamboo hat) stands on a small patch of sand beside a little wooden
fishing boat, holding a simple phone high above his head, squinting at it while searching for a
signal. One palm tree and a strip of calm sea as minimal shapes. Full-body, gentle and respectful
humor, a feeling of being disconnected. Crimson accent: a small crimson stripe on the boat.
```

### 6. C2: Pak Darto, served · 1024×1024 · `citizen-c-served.png`

```
[STYLE BLOCK]. The same Pak Darto as in C1 (same face, teal t-shirt, bamboo hat), now sitting on a
wooden bench next to a young village assistance officer in a navy uniform who holds a tablet and helps
him complete an application. Both are smiling. The same small boat and palm tree in the background as
minimal shapes. Warm and hopeful. Crimson accent: the officer's lanyard.
```

### 7. D: The overwhelmed drafter · 1536×1024 · `drafter.png`

```
[STYLE BLOCK]. An Indonesian civil servant (about 35, short black hair, thin glasses, navy-and-white
batik shirt) at an office desk at night, surrounded by towering stacks of thick law books and printed
documents with sticky notes. A small board behind the desk holds several pinned documents connected by
thin crimson red strings, some tangled and crossing, suggesting rules that conflict. A desk lamp glows,
a cold cup of coffee, the person rubs their eyes, tired but determined. Wide shot, slightly elevated
angle. Nothing on the documents is readable. Crimson accent: the strings.
```

## How to deliver

- Generate the images in the order above. If you can only produce one image per reply, generate the next one as soon as I reply "next".
- Under each image, write its file name (for example `citizen-a-locked.png`) so I can save it correctly.
- Before showing each image, check it against the Rules: plain `#F2F2F3` background, no text, one crimson accent, consistent character. If it fails, regenerate it.
- If I ask for a revision, change only what I mention and keep the character and style the same.
