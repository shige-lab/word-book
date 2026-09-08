# word-book

A vocabulary notebook for iOS and Android. You add the words you actually meet,
grade how well you know them, and revise them as flashcards.

Personal project, built to solve my own problem while learning English in
Australia. Not published to the stores.

## Why it works the way it does

**Everything is on the device.** There is no account, no server and no network
dependency for anything except looking a word up. Vocabulary revision happens in
gaps — on a train, waiting somewhere, before sleep — and those are exactly the
moments a sign-in screen or a loading spinner ends the session. The cost of the
choice is real and I accepted it: there is no sync, so the notebook lives on one
phone, and reinstalling loses it.

**Adding a word has to be nearly free.** A notebook you have to type into stops
getting used within a week. Typing the word alone fetches its definitions,
examples and phonetic spelling from [dictionaryapi.dev](https://dictionaryapi.dev),
which is free and needs no key; you keep the sense you meant and discard the
rest. This is the only network call in the app, and it fails soft — if it does
not answer, you get an empty form rather than an error.

**Two separate axes, not one score.** How well you know a word and how often it
comes up are different facts, and collapsing them into a single "level" loses
the distinction that matters when deciding what to revise. A rare word you have
mastered and a frequent word you half-recognise deserve opposite treatment, so
each word carries both:

- **Proficiency** — Unfamiliar / Recognize / Know / Master
- **Frequency** — Very Frequent / Frequent / Occasional / Rare

Revision is filtered on the pair, which is the whole point of storing them apart.

## Data model

Five SQLite tables. Categories own words and cascade on delete; proficiency and
frequency are lookup tables seeded on first launch, so their labels can change
without touching stored words.

| Table | Holds |
|---|---|
| `word` | the word, meaning, three examples, phonetic spelling, note, image |
| `category` | user-defined groups, hand-ordered via `order_index` |
| `proficiency` | the four knowledge levels, with icons |
| `frequency` | the four frequency levels, with colours |
| `search_history` | past lookups and a running count |

## Screens

Home, category, word detail and editor, search, and a flashcard deck that swipes
through the current filter. Pronunciation is spoken by the OS text-to-speech
voice rather than shipped as audio files, so it costs nothing and works for any
word.

## Stack

React Native 0.75 · TypeScript · Zustand · SQLite (`react-native-sqlite-storage`)
· React Navigation · react-native-magnus (patched)

## Running it

Requires Node 18+ and a working
[React Native environment](https://reactnative.dev/docs/environment-setup).

```bash
cd mobile
yarn install
cd ios && pod install && cd ..   # iOS only

yarn start                       # Metro
yarn ios                         # or: yarn android
```

The database is created and seeded on first launch; there is nothing to
configure.

## Status

Built between September 2024 and April 2025. It does what I wanted it to do and
I stopped there. The obvious missing piece is backup — the local-only decision
above is the right one for how the app is used, but losing the notebook with the
phone is a poor way to find that out.
