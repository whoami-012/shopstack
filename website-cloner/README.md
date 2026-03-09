# Website Cloner

A simple Python application to clone a website's static content (HTML, CSS, JS, and Images) for use as a template.

## Features
- Downloads main HTML page.
- Downloads assets (images, stylesheets, scripts).
- Rewrites links to point to local versions.
- Preserves basic directory structure.

## Setup

1. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Run the cloner with a URL:

```bash
python cloner.py https://example.com
```

You can also specify an output directory:

```bash
python cloner.py https://example.com my_template
```

## Disclaimer
This tool is for educational purposes and for cloning websites you own or have permission to use as templates. Always respect `robots.txt` and the terms of service of any website you visit.
