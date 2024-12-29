from setuptools import setup

APP = ['src/main.py']
DATA_FILES = [
    ('src/gui', ['src/gui/example_data.json']),
    ('src/services', []),
    ('', ['.env'])  # .env 파일도 포함
]
OPTIONS = {
    'argv_emulation': True,
    'packages': [
        'PyQt6',
        'requests',
        'openai',
        'google-api-python-client',
        'google-auth-httplib2',
        'google-auth-oauthlib'
    ],
    'iconfile': 'assets/app_icon.icns',  # 앱 아이콘 (필요시 추가)
    'plist': {
        'CFBundleName': "Cafe Scraper",
        'CFBundleDisplayName': "Cafe Scraper",
        'CFBundleIdentifier': "com.your-company.cafe-scraper",
        'CFBundleVersion': "1.0.0",
        'CFBundleShortVersionString': "1.0.0",
        'LSMinimumSystemVersion': "10.10.0",
        'NSHighResolutionCapable': True,
    }
}

setup(
    name="CafeScraper",
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
)
