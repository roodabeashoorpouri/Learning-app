As an expert product designer, I have reverse-engineered the illustration we just created to build a **Comprehensive Design System**. 

This system (let's call it the **"LinguaJoy" Design System**) is tailored for an EdTech, language-learning, or youth-focused platform. It is designed to feel approachable, energetic, clean, and highly scalable.

Here is your official guide to maintaining this exact visual identity across your app, website, and future illustrations.

---

### 🎨 1. Core Color Palette
The color system relies on vibrant, friendly primary colors grounded by soft, cool-toned neutrals. 

**Primary Colors (Brand & Characters)**
*   🔵 **Learning Blue:** `#4299E1` (Used for primary buttons, boy's theme, trust)
*   🔴 **Vibrant Coral:** `#F56565` (Used for active states, girl's theme, energy)

**Secondary Colors (Gamification & Accents)**
*   🟢 **Success Green:** `#48BB78` (Used for correct answers, progress bars, positive feedback)
*   🟠 **Action Orange:** `#ED8936` (Used for highlights, caps, secondary props)
*   🟡 **Reward Yellow:** `#ECC94B` (Used for stars, backpacks, achievements)

**Neutrals (Backgrounds & Text)**
*   ⚪ **Canvas White:** `#FFFFFF` (Cards, speech bubbles)
*   🧊 **Cloud Blue (Main BG):** `#F8FAFC` (App background)
*   ☁️ **Blob Accent BG:** `#EBF8FF` (Organic background shapes behind characters)
*   🌑 **Ink Dark (Text/Hair):** `#2D3748` (Primary typography, character eyes/hair)

**Gradients (For special UI elements)**
*   Always use a subtle linear gradient from Top (lighter) to Bottom (darker). 
*   *Example:* Top `#48BB78` → Bottom `#38A169`.

---

### ✍️ 2. Typography System
The typography must reflect the friendly, rounded nature of the illustrations.

*   **Primary Font:** **`Nunito`** (Its rounded terminals perfectly match the illustration style).
    *   *Fallback:* `Segoe UI`, `Varela Round`, or `Quicksand`.
*   **Hierarchy:**
    *   **H1 (Headers/Greetings):** Nunito ExtraBold (800), 22px - 32px.
    *   **UI Elements (Buttons/Bubbles):** Nunito Bold (700), 16px - 20px.
    *   **Body Text:** Nunito Regular (400), 14px - 16px.
    *   *Rule:* Text inside colorful UI elements should be White (`#FFFFFF`). Text inside white speech bubbles should match the character's theme color.

---

### 🖌️ 3. Illustration Generation Guidelines
If you are hiring a designer or using AI to generate more assets, use these strict rules to ensure they match the exact style of the boy and girl:

**A. Character Anatomy & Stroke Rules**
*   **"Noodle" Limbs:** Arms and legs are created using thick, uniform strokes with `stroke-linecap="round"`. No drawn fingers or toes (hands/feet are just rounded ends of the stroke).
    *   *Leg thickness:* ~22px-24px.
    *   *Arm thickness:* ~16px-18px.
*   **No Black Outlines:** Never use harsh black borders. If an outline is needed (like on the torso or legs), use a darker shade of the fill color (e.g., Light Blue shirt `#4299E1` gets a Dark Blue outline `#2B6CB0`).
*   **Geometric Base:** Heads are perfect circles. Torsos are thick, rounded lines or rounded rectangles.

**B. Facial Features**
*   **Minimalist:** Eyes are simple dark dots (`#2D3748`). 
*   **Mouths:** Simple floating curved lines (`fill="none"` with round caps). No lips or teeth.
*   **Blush:** Always add a soft blush under the eyes—a circle matching the character's theme color at 30% to 40% opacity.

**C. Backgrounds & Environments**
*   Do not draw realistic rooms or landscapes.
*   Use **Organic Blobs** (`#EBF8FF` or `#FEFCBF`) to ground the characters.
*   Add floating **"UI Confetti"**: Small plus signs (`+`), small geometric sparkles (✨), or floating dashed lines.

---

### 🔲 4. UI Component Styling (Cards & Bubbles)
When building the app interface around these illustrations, use these CSS/SVG rules:

*   **Border Radius (Rounded Corners):**
    *   *Speech Bubbles / Pills:* Fully rounded (`border-radius: 999px` or `rx="25"`).
    *   *Props (Books, Phones, Cards):* Subtly rounded (`border-radius: 4px` to `8px`).
*   **Shadows (The "Float" Effect):**
    *   Drop shadows should be soft, wide, and strictly vertical. Never harsh.
    *   *CSS Translation:* `box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);`
    *   *SVG Translation:* `<feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.08"/>`
*   **Speech Bubbles:** Always include a small triangular "tail" pointing directly at the character speaking.

---

### 🤖 5. Prompt Template for AI Generation (Midjourney/DALL-E)
If you are using AI to generate more assets for this project, use this exact prompt structure to get matching results:

> **Prompt:** *A flat vector illustration of [SUBJECT/ACTION, e.g., a teacher pointing at a chalkboard], modern corporate memphis style but cuter and more youthful. Minimalist faces with dot eyes and soft blush. Thick, uniform, rounded limbs like noodle arms. No black outlines, using tonal outlines instead. Color palette: Light blue background, vibrant coral pink, bright blue, success green, and warm yellow. Clean white speech bubbles with soft drop shadows. Educational, language learning theme, friendly, vector art, Dribbble style, white background.*

### 🚀 How to Apply This Today
1.  **In Figma/Sketch:** Create a Color Palette library using the hex codes above.
2.  **In CSS/Tailwind:** Add these hex codes to your `tailwind.config.js` under primary, secondary, and neutral. Set `box-shadow-soft` to the shadow value provided.
3.  **For your dev team:** Hand them the typography rules (import `Nunito` from Google Fonts).