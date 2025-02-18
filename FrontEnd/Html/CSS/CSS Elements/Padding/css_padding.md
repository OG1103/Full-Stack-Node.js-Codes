# CSS Padding (Complete Guide)

The `padding` property in CSS **creates space inside an element**, between its **content** and its **border**. 

### 🔹 How Padding Works:
- **Padding adds inner spacing** within an element.
- **It does not affect other elements** but only creates space inside.
- **It is inside any defined border** (if present).

## ✅ 1. Basic Padding Syntax:
```css
.box {
    padding: 20px; /* Adds 20px of inner space on all sides */
}
```

## ✅ 2. Different Ways to Define Padding:
```css
/* 1) Single Value (Applies to all sides) */
.box1 {
    padding: 15px; /* All four sides = 15px */
}

/* 2) Two Values (Vertical | Horizontal) */
.box2 {
    padding: 10px 20px; /* Top & Bottom = 10px, Left & Right = 20px */
}

/* 3) Three Values (Top | Horizontal | Bottom) */
.box3 {
    padding: 10px 15px 5px; /* Top = 10px, Left & Right = 15px, Bottom = 5px */
}

/* 4) Four Values (Top | Right | Bottom | Left) */
.box4 {
    padding: 5px 10px 15px 20px; /* Top = 5px, Right = 10px, Bottom = 15px, Left = 20px */
}

/* 5) Specific Padding for Each Side */
.box5 {
    padding-top: 20px;
    padding-right: 15px;
    padding-bottom: 10px;
    padding-left: 5px;
}
```

## ✅ 3. How Padding Affects Box Sizing:
- By default, padding **increases the size** of the element.
- Use `box-sizing: border-box;` to ensure padding **does not affect width**.

```css
.box {
    width: 200px;
    padding: 20px;
    box-sizing: border-box; /* Ensures width remains 200px */
}
```

## 🎯 Padding is useful for:
✔️ **Spacing content from the edge of the box**  
✔️ **Making text easier to read inside containers**  
✔️ **Creating space inside buttons, sections, or cards**  

---

## ✨ Example:
```css
.padding-box {
    border: 2px solid black;
    padding: 20px;
    background-color: lightgray;
}
```
