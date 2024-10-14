from fastapi.middleware.cors import CORSMiddleware

def add_cors(app):
    origins = [
        "http://localhost:8000",
        "http://localhost:3000"
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )