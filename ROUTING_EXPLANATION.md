# 🎓 Expo Router: La Guida Universitaria Completa

## Introduzione: Il Paradigma del File-based Routing

Benvenuto nella documentazione tecnica approfondita della navigazione in React Native con Expo Router.
Dimentica tutto ciò che sai sulla navigazione tradizionale "imperativa" (dove scrivi a mano le regole di routing). Expo Router adotta un approccio **dichiarativo basato sul File System**.

In questa architettura, **il File System È le API**.
Ogni file che crei nella cartella `app/` diventa automaticamente una rotta accessibile, un deep link, e una schermata nell'interfaccia utente.

---

## 🏗 Capitolo 1: L'Architettura dei Layout (`_layout.tsx`)

Il concetto più difficile e potente da comprendere è il **Layout**.

### 1.1 Cos'è realmente un Layout?

In termini di Computer Science, un Layout è un **Higher-Order Component (HOC)** persistente.
Quando navighi tra due pagine che condividono lo stesso Layout (esempio: da `Home` a `Profilo` dentro le `Tabs`), il Layout **NON viene smontato (unmounted)**.

Questo è fondamentale per:

- Mantenere lo stato globale (es. `GlobalProvider`).
- Mantenere elementi UI fissi (es. la TabBar in basso non "sfarfalla" quando cambi tab).
- Gestire transizioni fluide.

### 1.2 La Gerarchia (The Tree)

Expo Router costruisce un "Albero di Navigazione" (Navigation Tree).

```text
Root (_layout.tsx)
├── (tabs) (_layout.tsx)
│   ├── index (Home)
│   └── search
└── (auth) (_layout.tsx)
    ├── sign-in
    └── sign-up
```

#### Il Concetto di `<Slot />`

Se un `_layout.tsx` non usasse Stack o Tabs, dovrebbe usare un componente chiamato `<Slot />`.
Lo `<Slot />` è il punto esatto dove Expo inietta il "figlio" corrente.

> **Esempio:** Se sei in `/home`, lo `<Slot />` del Root Layout viene riempito con il contenuto di `(tabs)`, e lo `<Slot />` (o meglio, la scena attiva) di `(tabs)` viene riempita con `home.tsx`.

---

## 🧭 Capitolo 2: I Navigatori (Stack, Tabs, Drawer)

Expo Router avvolge la libreria nativa `React Navigation`. Esistono tre pattern o "archetipi" di navigazione principali.

### 2.1 Lo Stack (`<Stack>`)

**Metafora:** Un mazzo di carte o una pila di fogli.
**Comportamento:** Memoria LIFO (Last In, First Out).

- **Push:** Aggiungi una carta sopra.
- **Pop:** Rimuovi la carta superiore per tornare a quella sotto.

**Proprietà Avanzate:**

- `headerShown: false`: Rimuove la barra di navigazione nativa (quella con il titolo e la freccia indietro).
- `presentation: 'modal'`: Fa apparire la nuova schermata dal basso invece che da destra (utile per form o impostazioni).
- `animation`: Puoi controllare se la transizione è "slide_from_right", "fade", etc.

### 2.2 Le Tabs (`<Tabs>`)

**Metafora:** Un televisore o un browser web a schede.
**Comportamento:** Navigazione Parallela.
Le schermate delle Tab esistono **contemporaneamente** in memoria (spesso). Quando passi dalla Tab A alla Tab B:

1.  La Tab A non viene distrutta (il suo stato rimane).
2.  La Tab B viene mostrata (o montata se è la prima volta).

**Perché usiamo `Tabs` nel tuo progetto?**
In `app/(tabs)/_layout.tsx`, definiamo la barra di navigazione inferiore. Ogni `<Tabs.Screen />` rappresenta un pulsante in quella barra.

### 2.3 Il Drawer (Non usato qui, ma esiste)

**Metafora:** Un cassetto laterale.
È il menu che esce da sinistra ("Hamburger Menu"). Funziona come le Tabs (navigazione parallela) ma è nascosto finché non viene evocato.

---

## 🧬 Capitolo 3: Rotte Dinamiche e Parametri

Qui entriamo nella parte "scientifica" del routing: come passare dati tramite URL.

### 3.1 La Sintassi `[param]`

Quando vedi un file come `app/movies/[id].tsx`, quelle parentesi quadre trasformano il file in una **Wildcard** (Jolly).

- URL: `/movies/123` -> Matcha `[id].tsx`. `id` diventa `"123"`.
- URL: `/movies/avatar` -> Matcha `[id].tsx`. `id` diventa `"avatar"`.

### 3.2 Come recuperare i dati (`useLocalSearchParams`)

Dentro il componente `[id].tsx`, usiamo un Hook speciale:

```typescript
import { useLocalSearchParams } from "expo-router";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  // id ora contiene "123" o "avatar"

  // Fai una chiamata API per scaricare i dettagli del film con quell'ID
  // fetch(`api.themoviedb.org/movie/${id}`)
}
```

### 3.3 I Parametri "Catch-All" (`[...rest]`)

Esiste anche la sintassi con tre puntini: `app/blog/[...slug].tsx`.
Questa cattura **tutto** ciò che segue, all'infinito.

- `/blog/tech/2024/react` -> `slug` diventa `["tech", "2024", "react"]`.

---

## 📂 Capitolo 4: Gruppi (Groups) e Organizzazione File

Hai notato le cartelle con le parentesi tonde, tipo `(auth)` e `(tabs)`.
Questi sono **Gruppi Logici**.

### 4.1 La Regola dell'Invisibilità

Una cartella `(gruppo)` **NON appare nell'URL**.

- File: `app/(auth)/sign-in.tsx`
- URL Reale: `/sign-in` (NON `/auth/sign-in`)

### 4.2 Perché usarli?

Servono a due scopi fondamentali:

1.  **Organizzazione**: Per tenere ordinati i file (tutta la roba del login sta insieme).
2.  **Layout Multipli**: Questo è il motivo tecnico vero.
    - Vogliamo che le pagine di Login abbiano un `_layout` (Stack) senza barre.
    - Vogliamo che le pagine Home abbiano un `_layout` (Tabs) con la barra sotto.
    - L'unico modo per dare due Layout diversi a due gruppi di pagine è metterle in due cartelle Gruppo diverse.

L'albero del tuo progetto è un esempio perfetto di questo pattern:

- `(auth)` -> Usa Stack Layout (Login flow)
- `(tabs)` -> Usa Tabs Layout (App navigation)

---

## 🔗 Capitolo 5: Linking e Deep Links

Expo Router gestisce nativamente i Deep Links.
Se un utente clicca su un link `movieapp://movies/550` dal browser del telefono:

1.  Il telefono apre la tua app.
2.  Expo Router legge l'URL `/movies/550`.
3.  Cerca nel file system. Trova `app/movies/[id].tsx`.
4.  Apre quella schermata e passa `550` come parametro.

Tutto questo avviene senza che tu scriva una riga di codice extra. È il potere del File-based Routing.

---

## 🛠 Riepilogo Tecnico del Tuo Progetto

Analizziamo la tua struttura specifica:

1.  **`app/_layout.tsx` (Root)**
    - Contiene: `GlobalProvider` (Stato Utente), `Stack`.
    - Compito: Caricare i font, verificare se l'utente è loggato (in futuro), gestire errori globali.

2.  **`app/(auth)/_layout.tsx`**
    - Tipo: `Stack`
    - Compito: Permettere la navigazione Login <-> Registrazione.
    - Style: `headerShown: false` (Schermo intero).

3.  **`app/(tabs)/_layout.tsx`**
    - Tipo: `Tabs`
    - Compito: Mostrare la barra inferiore personalizzata.
    - Dettaglio: Abbiamo creato un componente `TabIcon` personalizzato per renderla bella graficamente.

4.  **`app/movies/[id].tsx`**
    - Tipo: Schermata (non Layout).
    - Compito: Ricevere un ID, scaricare i dati, mostrare il film.
