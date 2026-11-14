
# IDOR CTF Challenge

An educational Capture The Flag (CTF) web application designed to demonstrate Insecure Direct Object Reference (IDOR) vulnerabilities and understand how proper authorization prevents unauthorized access to resources.

## About the Project

This project demonstrates two types of IDOR vulnerabilities:

1. **Plain IDOR:** Accessing another user's document by changing its numeric document ID.
2. **Encoded IDOR:** Accessing another user's document by manipulating a Base64-encoded document ID.

It also includes a secure document endpoint that verifies document ownership before returning the requested resource.

## Project Objectives

- Understand Authentication vs Authorization.
- Learn how IDOR vulnerabilities occur.
- Demonstrate Plain IDOR attacks.
- Understand why Base64 encoding does not provide security.
- Implement ownership-based authorization.
- Practice identifying and preventing access control vulnerabilities.

## Disclaimer

This project is developed for educational and cybersecurity learning purposes only. The intentionally vulnerable endpoints should only be tested in this local CTF environment or other explicitly authorized environments.
