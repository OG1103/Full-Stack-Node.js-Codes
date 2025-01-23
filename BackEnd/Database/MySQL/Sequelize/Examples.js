// Complex Sequelize Queries with Explanations

import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js"; // Assuming Comment model exists
import { sequelize } from "./connectDb.js";

(async () => {
  try {
    // Example 1: Combining Aliases, Joins, and Selecting Specific Fields
    const postsWithAuthors = await Post.findAll({
      attributes: ["title", "content"], // Select specific fields from Post
      include: [
        {
          model: User,
          as: "author",
          attributes: [
            ["username", "author_name"],
            ["email", "author_email"],
          ], // Rename fields
        },
      ],
    });

    console.log("Posts with Authors:", JSON.stringify(postsWithAuthors, null, 2));
    /* Example Output:
    [
      {
        "title": "First Post",
        "content": "This is the content of the first post.",
        "author": {
          "author_name": "john_doe",
          "author_email": "john@example.com"
        }
      },
      {
        "title": "Second Post",
        "content": "Another great post content.",
        "author": {
          "author_name": "jane_doe",
          "author_email": "jane@example.com"
        }
      }
    ]
    */

    // Example 2: Subquery to Get Users Who Have Published Posts
    const activeUsers = await sequelize.query(`SELECT username, email FROM Users WHERE id IN (SELECT userId FROM Posts WHERE isPublished = true)`);

    console.log("Active Users (from subquery):", JSON.stringify(activeUsers, null, 2));
    /* Example Output:
    [
      { "username": "john_doe", "email": "john@example.com" },
      { "username": "jane_doe", "email": "jane@example.com" }
    ]
    */

    // Example 3: Combining Where Clauses, Aliases, and Aggregates
    const userPostCounts = await User.findAll({
      attributes: [
        ["username", "user_name"],
        [sequelize.fn("COUNT", sequelize.col("Posts.id")), "post_count"], // Aggregate to count posts
      ],
      include: [
        {
          model: Post,
          attributes: [], // Do not include any Post fields in the output
        },
      ],
      group: ["User.id"], // Group by User to enable aggregation
      having: sequelize.literal("post_count > 0"), // Only include users with posts
    });

    console.log("Users with Post Counts:", JSON.stringify(userPostCounts, null, 2));
    /* Example Output:
    [
      {
        "user_name": "john_doe",
        "post_count": 5
      },
      {
        "user_name": "jane_doe",
        "post_count": 3
      }
    ]
    */

    // Example 4: Nested Includes (Joins within Joins)
    const postsWithCommentsAndAuthors = await Post.findAll({
      attributes: ["title", "content"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username", "email"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["content"],
          include: [
            {
              model: User,
              as: "commenter",
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    console.log("Posts with Comments and Authors:", JSON.stringify(postsWithCommentsAndAuthors, null, 2));
    /* Example Output:
    [
      {
        "title": "First Post",
        "content": "This is the content of the first post.",
        "author": {
          "username": "john_doe",
          "email": "john@example.com"
        },
        "comments": [
          {
            "content": "Great post!",
            "commenter": {
              "username": "jane_doe"
            }
          },
          {
            "content": "Very informative.",
            "commenter": {
              "username": "mike_smith"
            }
          }
        ]
      },
      {
        "title": "Second Post",
        "content": "Another great post content.",
        "author": {
          "username": "jane_doe",
          "email": "jane@example.com"
        },
        "comments": [
          {
            "content": "Loved this!",
            "commenter": {
              "username": "john_doe"
            }
          }
        ]
      }
    ]
    */
  } catch (error) {
    console.error("Error executing complex queries:", error);
  }
})();
