Ah, this is a brilliant concept. You aren't just making flashcards; you are making a full digital textbook. To make this work in Cursor, we need a **single, powerful Master Prompt** that explains the complex structure of a single lesson.

We will use your favorite structure: **Context, Instruction, Constraint, Goal.**

---

### Master Prompt for the "Student Workbook" (Composer - Cmd + I)

Copy and paste this entire prompt into the Cursor Composer. It is detailed enough to give Cursor everything it needs for the structure.

> **Context:** You are a Mobile UI Architect and a Language Education Content Designer. We are building the **core lesson screen** for "Our Armenian Workbook," which must look exactly like a physical, beautifully illustrated student book from a language class.
> 
> **Instruction:** Create a `LessonWorkbookScreen.js` component. This screen will represent **one full lesson**. It must be scrollable, like a long book page.
> 
> You need to scaffold **four distinct sections** on this page, strictly in this order:
> 
> 1.  **Section 1: The Conversation (Sarah & John)**
>     * Display an illustration of Sarah and John.
>     * Show a dialogue between them about the lesson theme.
>     * This dialogue must be in **Armenian script, English phonetic, English translation**, and **Persian script**.
> 
> 2.  **Section 2: The Vocabulary Spotlight (Point & Learn)**
>     * Place a **large, high-resolution main illustration** (e.g., "Sarah and John in a vegetable shop").
>     * Add interactive **tap-targets** (dots/hotspots) on key objects in the picture (e.g., an apple, a carrot).
>     * When a user taps a hotspot, a label appears showing the name of the object in all three languages.
> 
> 3.  **Section 3: The Listening Lab**
>     * Add a large 'Play' button. Include the text: "Sarah says: 'Point to the green one.'" (Translate this instruction text into English and Persian).
>     * Add simple placeholder logic for where an audio file will load later.
> 
> 4.  **Section 4: The Workbook Activity (Fill the Blanks)**
>     * Create a simple sentence-completion exercise based on the conversation/vocabulary.
>     * Example: "Sarah has a red \_\_\_\_\_\_." (Users must type the Armenian word or choose from a list of options).
> 
> **Constraint:**
> 1.  The overall aesthetic must be "Cream Paper" and "Dark Blue Ink."
> 2.  **Crucial RTL Handling:** The Persian script must be right-aligned and use a font that looks professional for Arabic/Persian, distinct from the English font.
> 3.  Do not include the actual pictures yet; use clear **placeholders** (e.g., `<View style={{ backgroundColor: 'lightgray', height: 200 }}><Text>[INSERT SHOP PICTURE]</Text></View>`).
> 
> **Goal:** A single, beautifully structured, scrollable screen template that integrates all four classic workbook modalities (Conversation, Vocabulary, Listening, Application), ready to accept content.

---

### Your Next Step

After Cursor builds this, you will have the complex "shell" of your lesson. Your next job will be to **fill it with data**.

**Would you like me to write the JSON data structure for the *first lesson* (like a supermarket) that you can paste into this new screen to test the hotspots and dialogue?**