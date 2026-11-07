#!/usr/bin/env python3
"""Jednoduchý lokální web server pro vývoj.

Použití:
    python3 serve.py            # http://localhost:8000
    python3 serve.py 3000       # jiný port
    python3 serve.py --open     # rovnou otevře prohlížeč

Posílá hlavičky proti cachování, takže změny v CSS/JS se projeví po obyčejném F5.
"""
import argparse
import functools
import http.server
import os
import socketserver
import webbrowser


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".css": "text/css",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def main():
    parser = argparse.ArgumentParser(description="Lokální server pro becvar-site")
    parser.add_argument("port", nargs="?", type=int, default=8000, help="port (výchozí 8000)")
    parser.add_argument("--host", default="127.0.0.1", help="adresa (0.0.0.0 = dostupné v síti)")
    parser.add_argument("--open", action="store_true", help="otevřít v prohlížeči")
    args = parser.parse_args()
    root = os.path.dirname(os.path.abspath(__file__))
    handler = functools.partial(NoCacheHandler, directory=root)

    with Server((args.host, args.port), handler) as httpd:
        url = f"http://{'localhost' if args.host in ('127.0.0.1', '0.0.0.0') else args.host}:{args.port}/"
        print(f"Server běží na {url}  (Ctrl+C pro ukončení)")
        if args.open:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer ukončen.")

if __name__ == "__main__":
    main()
