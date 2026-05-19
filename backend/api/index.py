import sys
from pathlib import Path

# Add backend folder to Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BACKEND_DIR))

from app import app