#!/usr/bin/env python3
"""Serve the static dashboard from the release repository root."""

from __future__ import annotations

import http.server
from functools import partial
import socketserver
from pathlib import Path


PORT = 8766
HOST = "127.0.0.1"


class ThreadingTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
    with ThreadingTCPServer((HOST, PORT), handler) as httpd:
        print(f"Serving {root}")
        print(f"Open http://{HOST}:{PORT}/dashboard/index.html")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
