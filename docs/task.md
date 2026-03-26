🚀 Project Roadmap & Task Prioritization


🔴 CRITICAL: System Stability & Authentication
Fix Workbook Redirect Bug

Issue: Redirects to Login Page instead of Workbook Main Page after completion.

Action: Audit the "OnComplete" session handler.

Email Uniqueness & Session Memory

Requirement: Prevent multiple accounts from being created with the same email.

Logic: Implement a "Unique" constraint on the email field in the database and a check during the sign-up flow to alert the user if an account already exists.

Status: 🚨 High Priority

🔴 High Priority: Core Logic & Architecture
Implement Dual-Language UI Logic

Description: Develop the system-wide language toggle for the trilingual database.

Constraint: Every user profile must default to a two-language setup:

Primary: Armenian (Fixed)

Secondary: English OR Farsi (User's choice)

Scope: Settings menu, system strings, and all UI components.

🟠 High Priority: UI & Localization
Profile Page UI Enhancement
Requirement: Improve the visual design and user experience of the Profile screen.

Goal: Create a cleaner, more engaging dashboard for user settings and progress.

🟡 Medium Priority: Brand Identity
App Logo Design

Description: Create a scalable vector logo.

Requirements: Must work as a high-res splash screen and a simplified favicon/app icon.

🟢 Low Priority: Visual Assets
Character Illustrations: Sarah & John

Description: Design custom illustrations for the characters Sarah and John to be used throughout the app (onboarding, empty states, or help sections).

Note: Ensure their style aligns with the final logo's aesthetic.