import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys

class WebsiteCloner:
    def __init__(self, base_url, output_dir):
        self.base_url = base_url
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.downloaded_assets = set()

        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def is_valid_url(self, url):
        parsed = urlparse(url)
        return bool(parsed.netloc) and bool(parsed.scheme)

    def get_local_path(self, url):
        parsed = urlparse(url)
        path = parsed.path
        if not path or path.endswith('/'):
            path += 'index.html'
        
        # Remove leading slash and construct local path
        local_path = os.path.join(self.output_dir, path.lstrip('/'))
        return local_path

    def download_asset(self, url):
        if url in self.downloaded_assets or not self.is_valid_url(url):
            return None

        try:
            response = self.session.get(url, stream=True, timeout=10)
            if response.status_code == 200:
                local_path = self.get_local_path(url)
                os.makedirs(os.path.dirname(local_path), exist_ok=True)
                
                with open(local_path, 'wb') as f:
                    for chunk in response.iter_content(1024):
                        f.write(chunk)
                
                self.downloaded_assets.add(url)
                # Return path relative to the HTML file
                return os.path.relpath(local_path, self.output_dir)
        except Exception as e:
            print(f"Error downloading {url}: {e}")
        return None

    def clone(self):
        print(f"Cloning {self.base_url}...")
        try:
            response = self.session.get(self.base_url, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Process Images
            for img in soup.find_all('img'):
                src = img.get('src')
                if src:
                    full_url = urljoin(self.base_url, src)
                    local_rel_path = self.download_asset(full_url)
                    if local_rel_path:
                        img['src'] = local_rel_path

            # Process CSS
            for link in soup.find_all('link', rel='stylesheet'):
                href = link.get('href')
                if href:
                    full_url = urljoin(self.base_url, href)
                    local_rel_path = self.download_asset(full_url)
                    if local_rel_path:
                        link['href'] = local_rel_path

            # Process JavaScript
            for script in soup.find_all('script', src=True):
                src = script.get('src')
                if src:
                    full_url = urljoin(self.base_url, src)
                    local_rel_path = self.download_asset(full_url)
                    if local_rel_path:
                        script['src'] = local_rel_path

            # Save the modified HTML
            with open(os.path.join(self.output_dir, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            
            print(f"Successfully cloned {self.base_url} to {self.output_dir}")

        except Exception as e:
            print(f"Failed to clone website: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python cloner.py <url> [output_directory]")
        sys.exit(1)
    
    target_url = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else "cloned_site"
    
    cloner = WebsiteCloner(target_url, output)
    cloner.clone()
