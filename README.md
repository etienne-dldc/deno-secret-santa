# 🎅 Secret Santa 🎅

A simple web application for organizing Secret Santa gift exchanges, built with Deno and Hono.

## ✨ How to use

1.  **🎁 Set up your Project:**
    * **Create a new project** by choosing a **Name** (e.g., "Office Party 2025").
    * *Optional:* Add an **Admin Password** to secure settings and the final draw.

2.  **🔗 Invite Participants:**
    * **Share the unique project link** with everyone.
    * Participants register using their **Name** and a **Personal Password** (No email needed!).

3.  **🛡️ Define Rules (If Needed):**
    * *Optional:* As the admin, return to the project to set up **Drawing Constraints** (e.g., preventing specific people or couples from drawing each other).

4.  **🎉 Run the Draw:**
    * Once registration is complete, the admin **runs the draw**. The assignments are now locked in and secret.

5.  **👀 Reveal the Recipient:**
    * Participants can return to the app's project page.
    * They enter the **Personal Password** they used during registration to privately view **who they are buying a gift for.**

## 🛠️ Technology Stack

- **[Deno](https://deno.land/)**: Modern JavaScript/TypeScript runtime
- **[Hono](https://hono.dev/)**: Fast, lightweight web framework
- **[Deno KV](https://deno.com/kv)**: Built-in key-value database
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Valibot](https://valibot.dev/)**: Schema validation library
- **[bcrypt](https://jsr.io/@felix/bcrypt)**: Secure password hashing

## 📋 Prerequisites

- [Deno](https://deno.land/)

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

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Etienne Dldc**

- GitHub: [@etienne-dldc](https://github.com/etienne-dldc)

## 🙏 Acknowledgments

- Built with ❤️ using Deno
- Icons: Santa emoji 🎅
- Analytics: [Plausible](https://plausible.io) (privacy-friendly)

---

Made with 🎄 for the holiday season!
