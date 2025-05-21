Step 1: Install Python (if not already installed)
Python is a programming language that includes a simple web server.

🪟 On Windows:
Go to https://www.python.org/downloads

Click the yellow “Download Python” button

Run the installer

⚠️ IMPORTANT: Make sure to check the box that says
✅ "Add Python to PATH" before clicking Install

🍎 On Mac:
Open Terminal and type:

python3 --version

If it says something like Python 3.11.x, you're good to go. If not, install it from python.org


Step 1.1: Start Your Local Web Server
Let’s now serve the site so your browser can run the JavaScript.

💡 Use Terminal or Command Prompt:

On Windows:
Press Windows + R, type cmd, then hit Enter

Type the following to move into your folder (replace YourUsername):
cd C:\Users\YourUsername\Downloads\alliance-graph-files

On Mac:
Open the Terminal (press Cmd + Space, type “Terminal”)

Navigate to the folder:

cd ~/Downloads/alliance-graph-files

🚀 Start the Server:

python -m http.server 8000

🌐 Open your browser and go to:

http://localhost:8000

You should now see the alliance graph working in your browser!
