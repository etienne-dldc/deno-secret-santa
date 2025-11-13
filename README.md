# 🎅 Secret Santa 🎅

A modern, privacy-focused web application for organizing Secret Santa gift exchanges, built with Deno and Hono.

## ✨ Features

- **Easy Project Creation**: Create a Secret Santa project with just a name
- **Participant Management**: Add participants with names, hints for gift ideas, and secure passwords
- **Random Assignment**: Automatically generate random gift assignments with the click of a button
- **Secure Results**: Participants can securely view their assigned recipient using their password
- **Privacy-First**: Each participant only sees who they need to buy a gift for
- **No Email Required**: Simple password-based authentication without the need for email addresses
- **Beautiful UI**: Clean, responsive interface with Tailwind CSS
- **Persistent Storage**: Uses Deno KV for reliable data storage

## 🛠️ Technology Stack

- **[Deno](https://deno.land/)**: Modern JavaScript/TypeScript runtime
- **[Hono](https://hono.dev/)**: Fast, lightweight web framework
- **[Deno KV](https://deno.com/kv)**: Built-in key-value database
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Valibot](https://valibot.dev/)**: Schema validation library
- **[bcrypt](https://jsr.io/@felix/bcrypt)**: Secure password hashing

## 📋 Prerequisites

- [Deno](https://deno.land/) 1.x or higher installed on your system

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/etienne-dldc/deno-secret-santa.git
cd deno-secret-santa
```

2. Run the application:
```bash
deno task start
```

The application will start on `http://localhost:8000` (or the port specified by Deno).

### Development Mode

For development with hot-reload:
```bash
deno task dev
```

## 📖 Usage Guide

### Creating a Secret Santa Project

1. Visit the homepage
2. Enter a project name (e.g., "Family Christmas 2025")
3. Click "Créer un projet" to create your project
4. Share the project URL with participants

### Adding Participants

1. On the project page, click "Ajouter un participant"
2. Fill in the participant information:
   - **Name**: The participant's name
   - **Hint**: A hint about what gifts they'd like
   - **Password**: A secure password the participant will use to view their assignment
3. Submit the form

### Running the Draw

1. Once you have at least 2 participants, click "Lancer le tirage au sort"
2. Confirm the draw on the next page
3. The system will randomly assign each participant to another participant

### Viewing Assignments

1. Navigate to the results page
2. Each participant selects their name and enters their password
3. They will see who they need to buy a gift for, along with that person's gift hints

## 🔒 Security & Privacy

- Passwords are hashed using bcrypt before storage
- Each participant can only view their own assignment
- No email addresses or personal information required
- Data is stored securely in Deno KV

## 🌐 Deployment

This application is designed to be deployed on [Deno Deploy](https://deno.com/deploy):

1. Create a Deno Deploy account
2. Link your GitHub repository
3. Deploy with automatic builds on push

The project includes deployment configuration in `deno.json`:
```json
{
  "deploy": {
    "org": "etienne-dldc",
    "app": "deno-secret-santa"
  }
}
```

## 📁 Project Structure

```
.
├── components/      # Reusable UI components
│   ├── Card.tsx
│   ├── Layout.tsx
│   ├── ProjectForm.tsx
│   └── ...
├── logic/          # Business logic and types
│   ├── types.ts
│   ├── shuffle.ts
│   └── schemas.tsx
├── views/          # Page views
│   ├── Home.tsx
│   ├── Project.tsx
│   ├── Results.tsx
│   └── ...
├── main.tsx        # Application entry point
└── deno.json       # Deno configuration
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Etienne Dldc**

- GitHub: [@etienne-dldc](https://github.com/etienne-dldc)
- Website: [etienne.tech](http://etienne.tech)

## 🙏 Acknowledgments

- Built with ❤️ using Deno
- Icons: Santa emoji 🎅
- Analytics: [Plausible](https://plausible.io) (privacy-friendly)

---

Made with 🎄 for the holiday season!
