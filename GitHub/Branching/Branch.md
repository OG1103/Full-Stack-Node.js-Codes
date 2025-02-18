# 🚀 Git Branching Guide

This guide covers everything you need to know about working with branches in Git and GitHub, including creating, switching, deleting, and working with remote branches.

---

## 📚 **Table of Contents**
1. [Introduction to Git Branches](#introduction-to-git-branches)
2. [Creating and Managing Branches](#creating-and-managing-branches)
3. [Working with Remote Branches](#working-with-remote-branches)
4. [Deleting Branches](#deleting-branches)
5. [Quick Command Summary](#quick-command-summary)

---

## 🚀 **Introduction to Git Branches**

A **Git branch** is an independent line of development in your project. Branches help you work on different features, bug fixes, or experiments without affecting the main codebase.

- **`main` or `master`**: The default branch where the production code lives.
- **Feature branches**: For developing new features.
- **Hotfix branches**: For urgent bug fixes.

---

## ✅ **Creating and Managing Branches**

### 1️⃣ **Create a New Local Branch**

```bash
git branch <branch-name>
```
- **Purpose:** Creates a new branch locally.
- **Example:**
  ```bash
  git branch feature-login
  ```

### 2️⃣ **List All Branches**

```bash
git branch
```
- **Purpose:** Lists all local branches.
- **List Remote Branches:**
  ```bash
  git branch -r
  ```
- **List Local + Remote Branches:**
  ```bash
  git branch -a
  ```

### 3️⃣ **Rename the Current Branch**

```bash
git branch -m <new-branch-name>
```
- **Example:**
  ```bash
  git branch -m feature-dashboard
  ```
- **Rename Another Branch:**
  ```bash
  git branch -m old-name new-name
  ```

### 4️⃣ **Switch Between Branches**

```bash
git checkout <branch-name>
```
OR using the newer command:
```bash
git switch <branch-name>
```
- **Purpose:** Switches to another branch.
- **Example:**
  ```bash
  git checkout develop
  ```

### 5️⃣ **Create and Switch to a New Branch (One Command)**

```bash
git checkout -b <branch-name>
```
OR:
```bash
git switch -c <branch-name>
```
- **Purpose:** Creates a new branch and switches to it immediately.
- **Example:**
  ```bash
  git checkout -b feature-payment
  ```

---

## 🌐 **Working with Remote Branches**

### 6️⃣ **Show Remote Repositories**

```bash
git remote -v
```
- **Purpose:** Lists all remote repositories connected to your project.
- **Example Output:**
  ```
  origin  https://github.com/user/repo.git (fetch)
  origin  https://github.com/user/repo.git (push)
  ```

### 7️⃣ **Create a Local Branch from a Remote Branch and Start Committing**

```bash
git checkout -b <local-branch-name> origin/<remote-branch-name>
```
OR:
```bash
git switch -c <local-branch-name> --track origin/<remote-branch-name>
```
- **Purpose:** Creates a local branch based on a remote branch.
- **Example:**
  ```bash
  git checkout -b feature-login origin/feature-login
  ```
- **Explanation:**
  - `-b`: Creates the new branch.
  - `origin/feature-login`: Specifies the remote branch to track.

### 8️⃣ **Pull the Latest Changes from Remote**

```bash
git pull origin <branch-name>
```
- **Example:**
  ```bash
  git pull origin feature-login
  ```
- **Purpose:** Fetches and merges changes from the remote repository.

---

## ❌ **Deleting Branches**

### 9️⃣ **Delete a Local Branch (Safe Method)**

```bash
git branch -d <branch-name>
```
- **Purpose:** Deletes the branch only if it has been merged.
- **Example:**
  ```bash
  git branch -d feature-login
  ```

### 🔥 **Force Delete a Local Branch (Unsafe Method)**

```bash
git branch -D <branch-name>
```
- **Purpose:** Deletes the branch even if it has unmerged changes.
- **Example:**
  ```bash
  git branch -D feature-login
  ```

### ⚠️ **Important:**
- You **cannot delete** the branch you’re currently on.
- Switch to another branch before deleting:
  ```bash
  git checkout main
  ```

---

## 🚀 **Quick Command Summary**

| **Action**                                      | **Command**                                |
|------------------------------------------------|--------------------------------------------|
| Create a new local branch                      | `git branch <branch-name>`                 |
| List all branches                              | `git branch`                               |
| Rename the current branch                      | `git branch -m <new-name>`                 |
| Switch to another branch                       | `git checkout <branch-name>`               |
| Show remote repositories                       | `git remote -v`                            |
| Create & switch to a new branch                | `git checkout -b <branch-name>`            |
| Create a local branch from a remote branch     | `git checkout -b <local> origin/<remote>`  |
| Pull latest changes from remote                | `git pull origin <branch-name>`            |
| Delete a local branch (safe)                   | `git branch -d <branch-name>`              |
| Force delete a local branch                    | `git branch -D <branch-name>`              |

---

## ✅ **Conclusion**

Git branching allows you to work on features, fixes, and experiments without affecting the main codebase. Mastering these commands ensures smoother workflows, especially when collaborating with teams on GitHub.

