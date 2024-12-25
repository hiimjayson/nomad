from setuptools import setup, find_packages

setup(
    name="cafe-scraper",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "selenium",
        "pytest",
    ],
    extras_require={
        "dev": [
            "pytest",
            "black",
            "flake8",
        ]
    },
)
