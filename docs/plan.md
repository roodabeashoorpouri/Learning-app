# Project Plan: Armenian Language Learning App

## 1. Project Overview
This application is a formal, academic-style platform for mastering the Armenian language. Modeled after traditional classroom curricula (**Student Book** and **Workbook**), the app prioritizes a structured, linear learning path over casual gamification, targeting serious learners who want a deep understanding of the language.

---

## 2. Core User Experience (UX) & Global Mechanics

### A. The "Immersion Engine" (Global Features)
These mechanics apply to **every** section of the app:
* **Hidden Translation (Discovery Learning):** To prioritize immersion, the interface displays only Armenian text by default. Users must **tap** words or sentences to toggle the translation.
* **Integrated Audio:** Every Armenian text element (labels, bubbles, paragraphs) is paired with a **Speaker Icon**. Tapping this plays high-quality native pronunciation.
* **Visual Continuity:** The app uses a "Zoom-Out" narrative logic to connect Conversation and Reading sections, creating a cohesive sense of place.

### B. Navigation Logic
* **Horizontal Pagination (Cross-Section):** Users move between the 4 core pillars (Conversation → Reading → Listening → Writing) by **swiping horizontally**, mimicking a physical textbook.
* **Vertical Scrolling (Intra-Section):** Within the Listening and Writing sections, users scroll vertically to access multiple exercises or long-form content.

---

## 3. Section 1: Conversation (The Speaking Hub)
**Goal:** Introduce the lesson theme through situational dialogue and social interaction.

* **Visual Focus:** A close-up illustration of the primary characters (**Sarah and John**). The background provides subtle environmental hints (e.g., a bus stop sign or a doctor’s diploma) to set the stage.
* **UI Mechanics:** * Dialogue is displayed in **Armenian speech clouds**.
    * Translation is hidden until the user taps the cloud.
    * An Audio Icon is present for each line of dialogue.
* **Character Evolution:** While the first lessons feature Sarah and John, the cast will expand as the curriculum progresses to include diverse personalized characters.

---

## 4. Section 2: Reading (Contextual Vocabulary & Narrative)
**Goal:** Transition from specific dialogue to broader environmental vocabulary and literacy.

* **The "Zoom Out" Visual:** The UI reveals a wide-angle version of the Section 1 scene. 
    * *Example:* If Section 1 was a close-up of a conversation, Section 2 reveals the entire bus station, the crowd, the street, and the scenery.
* **Interactive Image Labels:** Key objects within the wide illustration (e.g., "tree," "bench," "bus") are labeled in Armenian. These labels follow the "tap-to-translate" and "tap-to-hear" rules.
* **Text Evolution:** * **Level 1 (Foundational):** Simple, descriptive sentences beneath the image (e.g., "This is a red bus").
    * **Level 2 (Advanced/Lesson 20+):** Multi-paragraph narratives or short stories that utilize all vocabulary introduced in the scene.

---

## 5. Section 3: Listening (The Auditory & Speech Lab)
**Goal:** Develop phonetic accuracy and active recall through a "Listen and Repeat" loop.

* **Layout:** A vertical scroll of card-based exercises.
* **Mechanics:**
    1.  **Output (Listening):** User taps the **Speaker Icon** to hear a native word/phrase.
    2.  **Input (Speaking):** User taps the **Microphone Icon** to record their own pronunciation.
* **AI Feedback:** An integrated speech-recognition system analyzes the user's audio and provides immediate visual feedback/correction on their pronunciation.
* **Scaling:** Exercises range from single words in early lessons to full complex sentences in later stages.

---

## 4. Section 4: Writing (The Script & Literacy Lab)
**Goal:** Master the Armenian alphabet (Ayububen) and orthography (spelling).

* **Alphabet Mastery (Early Lessons):**
    * **Stroke Order:** An animated guide demonstrates the proper direction and sequence for writing each letter.
    * **Dual Input:** Users can choose to **Trace/Draw** the character using their finger or **Type** it using an Armenian keyboard layout.
* **Transcription (Advanced Lessons):**
    * Users scroll vertically to find writing prompts for full words introduced in the lesson.
    * This reinforces the connection between individual characters and their role in functional vocabulary.

---

## 7. Navigation & Interaction Summary

| Action | Result |
| :--- | :--- |
| **Horizontal Swipe** | Switch Section (e.g., Conversation to Reading) |
| **Vertical Scroll** | Explore more items within Listening or Writing pages |
| **Tap Armenian Text** | Toggle hidden translation (English/Target Language) |
| **Tap Speaker Icon** | Play native Armenian audio playback |
| **Tap Microphone** | Record user voice for pronunciation check (Section 3) |