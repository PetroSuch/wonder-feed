const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "article-chatgpt",
});

connection.connect();

const port = process.env.PORT || 8080;

const app = express().use(cors()).use(bodyParser.json());

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

app.get("/getArticlesLocal", (req, res) => {
  let { offset = 0 } = req.query;

  let query = "select count(*) as count from articles";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    }
    let count = result[0].count;

    if (count < parseInt(offset) + 10) {
      offset = 0;
    }
    let sql =
      `select articles.*, users.id as user_id, users.email, users.username, categories.id as category_id, categories.name as category_name
              from articles 
              left join users on articles.author_id = users.id 
              left join categories on articles.category_id = categories.id
              order by id desc 
              limit 10 offset ` + offset;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Error fetching articles" });
      } else {
        if (result.length > 0) {
          res.json(result);
        } else {
          res.send({ msg: "No data" });
        }
      }
    });
  });
});

app.get("/getCategories", (req, res) => {
  let sql = `WITH RECURSIVE category_hierarchy AS (
              SELECT
                  id,
                  name,
                  parent,
                  0 AS level,
                  CAST(id AS CHAR(200)) AS path
              FROM
                  categories
              WHERE
                  parent = 0
              
              UNION ALL
              
              SELECT
                  c.id,
                  CONCAT(REPEAT(' ', ch.level * 4), c.name) AS name,
                  c.parent,
                  ch.level + 1,
                  CONCAT(ch.path, '-', CAST(c.id AS CHAR(200))) AS path
              FROM
                  categories c
              JOIN
                  category_hierarchy ch ON c.parent = ch.id
          )

          SELECT
              id,
              name,
              parent,
              level
          FROM
              category_hierarchy
          ORDER BY
              path;`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      if (result.length > 0) {
        res.json(result);
      } else {
        res.send({ msg: "No data" });
      }
    }
  });
});

app.get("/getUsers", (req, res) => {
  let sql = `select * from users`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      if (result.length > 0) {
        res.json(result);
      } else {
        res.send({ msg: "No data" });
      }
    }
  });
});

app.post("/getArticles", (req, res) => {
  const title = req.body.title;
  const keywords = req.body.keywords;
  const category = req.body.category;
  const category_id = req.body.category_id;

  let user_id = req.session.user[0].id;

  let sql = `select * from settings where settings.user_id = ` + user_id;

  db.query(sql, async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      let numberTitle = "";
      let numberImageAlt = "";
      let numberDescription = "";
      let toneOfVoice = "";
      let exampleTitle = "";
      let exampleDesc = "";
      let exampleAlt = "";

      let summaryTitle = "";
      let summaryDesc = "";
      let summaryAlt = "";

      let rulesSeo = "";
      let rulesSeoDesc = "";
      let rulesSeoAlt = "";

      if (result.length > 0) {
        result = result[0];

        numberTitle = result.number_title;
        numberImageAlt = result.number_alt;
        numberDescription = result.number_desc;
        toneOfVoice = result.tone_of_voice;
        exampleTitle = result.ex_title;
        exampleDesc = result.ex_desc;
        exampleAlt = result.ex_alt;

        summaryTitle = result.summary_title;
        summaryDesc = result.summary_desc;
        summaryAlt = result.summary_alt;

        rulesSeo = result.rules_seo;
        rulesSeoDesc = result.rules_seo_desc;
        rulesSeoAlt = result.rules_seo_alt;
      }

      try {
        const articles = await generateArticle(
          title,
          keywords,
          category,
          numberTitle,
          numberImageAlt,
          numberDescription,
          toneOfVoice,
          exampleTitle,
          exampleDesc,
          exampleAlt,
          summaryTitle,
          summaryDesc,
          summaryAlt,
          rulesSeo,
          rulesSeoDesc,
          rulesSeoAlt,
        );

        res.json({ articles: articles });

        for (var i = 0; i < articles.length; i++) {
          let title = articles[i].message.content.split("\n")[0];
          let description =
            articles[i].message.content.split("\n").length > 1
              ? articles[i].message.content.split("\n")[1]
              : articles[i].message.content.split("\n")[0];
          let alt_text =
            articles[i].message.content.split("\n") > 2
              ? articles[i].message.content.split("\n")[2]
              : articles[i].message.content.split("\n")[0];

          if (title != "") {
            title = title.replace("Title:", " ");
            title = title.replace(/"/g, "");
          }

          if (description != "") {
            description = description.replace("Description:", " ");
            description = description.replace(/"/g, "");
          }

          if (alt_text != "") {
            alt_text = alt_text.replace("Alt text of the image:", " ");
            alt_text = alt_text.replace(/"/g, "");
          }

          let sql =
            'INSERT INTO articles (title, description, status, created_at, author_id, category_id, publication_date, alt_text) VALUES ("' +
            title +
            '", "' +
            description +
            '", 4, CURRENT_DATE(), ' +
            user_id +
            ", " +
            category_id +
            ', CURRENT_DATE(), "' +
            alt_text +
            '")';

          db.query(sql, (err, result) => {
            if (err) {
              console.log(err);
            }
          });
        }
      } catch (error) {
        console.error("Error generating article:", error);
        res.status(500).json({ error: "Error generating article" });
      }
    }
  });
});

app.get("/getArticle", (req, res) => {
  let articleId = req.query.articleId;

  let sql = `select * from articles where articles.id = ` + articleId;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      if (result.length > 0) {
        res.json(result);
      } else {
        res.send({ msg: "No data" });
      }
    }
  });
});

app.post("/saveSettings", async (req, res) => {
  let toneOfVoice = req.body.toneOfVoice
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let summaryTitle = req.body.summaryTitle
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let numberTitle = req.body.numberTitle
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let rulesSeo = req.body.rulesSeo.replace(/'/g, "\\'").replace(/"/g, '\\"');
  let exTitle = req.body.exTitle.replace(/'/g, "\\'").replace(/"/g, '\\"');

  let summaryDesc = req.body.summaryDesc
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let numberDesc = req.body.numberDesc
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let rulesSeoDesc = req.body.rulesSeoDesc
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let exDesc = req.body.exDesc.replace(/'/g, "\\'").replace(/"/g, '\\"');

  let summaryAlt = req.body.summaryAlt
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let numberAlt = req.body.numberAlt.replace(/'/g, "\\'").replace(/"/g, '\\"');
  let rulesSeoAlt = req.body.rulesSeoAlt
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  let exAlt = req.body.exAlt.replace(/'/g, "\\'").replace(/"/g, '\\"');

  try {
    let user_id = req.session.user[0].id;

    if (user_id != undefined) {
      let query =
        "select count(*) as count from settings where user_id=" + user_id;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
        }
        let count = result[0].count;

        let sql = "";
        if (count > 0) {
          let updateSql =
            "UPDATE settings SET tone_of_voice='" +
            toneOfVoice +
            "', summary_title='" +
            summaryTitle +
            "', number_title='" +
            numberTitle +
            "', rules_seo='" +
            rulesSeo +
            "', ex_title='" +
            exTitle +
            "', summary_desc='" +
            summaryDesc +
            "', number_desc='" +
            numberDesc +
            "', rules_seo_desc='" +
            rulesSeoDesc +
            "', ex_desc='" +
            exDesc +
            "', summary_alt='" +
            summaryAlt +
            "', number_alt='" +
            numberAlt +
            "', rules_seo_alt='" +
            rulesSeoAlt +
            "', ex_alt='" +
            exAlt +
            "' where user_id=" +
            user_id;
          sql = updateSql;
        } else {
          let insertSql =
            "INSERT INTO settings (user_id, tone_of_voice, summary_title, number_title, rules_seo, ex_title, summary_desc, number_desc, rules_seo_desc, ex_desc, summary_alt, number_alt, rules_seo_alt, ex_alt) VALUES (" +
            user_id +
            ",'" +
            toneOfVoice +
            "','" +
            summaryTitle +
            "','" +
            numberTitle +
            "','" +
            rulesSeo +
            "','" +
            exTitle +
            "','" +
            summaryDesc +
            "','" +
            numberDesc +
            "','" +
            rulesSeoDesc +
            "','" +
            exDesc +
            "','" +
            summaryAlt +
            "','" +
            numberAlt +
            "','" +
            rulesSeoAlt +
            "','" +
            exAlt +
            "')";
          sql = insertSql;
        }

        db.query(sql, (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: "Error generating article" });
  }
});

app.get("/getSettings", (req, res) => {
  let user_id = req.session.user[0].id;

  let sql = `select * from settings where settings.user_id = ` + user_id;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      if (result.length > 0) {
        res.json(result);
      } else {
        res.send({ msg: "No data" });
      }
    }
  });
});

app.post("/updateCategory", async (req, res) => {
  const articleId = req.body.articleId;
  const category_id = req.body.category_id;

  try {
    let sql =
      "UPDATE articles SET category_id=" +
      category_id +
      " where id=" +
      articleId;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Error updating category" });
  }
});

app.post("/updateStatus", async (req, res) => {
  const articleId = req.body.articleId;
  const status_index = req.body.status_index;

  try {
    let sql =
      "UPDATE articles SET status=" + status_index + " where id=" + articleId;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: "Error generating article" });
  }
});

app.post("/updateUser", async (req, res) => {
  const articleId = req.body.articleId;
  const user_id = req.body.user_id;

  try {
    let sql =
      "UPDATE articles SET author_id=" + user_id + " where id=" + articleId;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.error("Error generating article:", error);
    res.status(500).json({ error: "Error generating article" });
  }
});

app.get("/toDuplicate", (req, res) => {
  let articleId = req.query.articleId;

  let sql = `select * from articles where articles.id = ` + articleId;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      if (result.length > 0) {
        let articleData = result[0];

        // Assuming the 'id' is auto-incremented and should not be duplicated.
        // Remove the 'id' from the article data to allow the database to generate a new one.
        delete articleData.id;

        let columns = Object.keys(articleData).join(", ");
        let placeholders = Object.keys(articleData)
          .map(() => "?")
          .join(", ");
        let values = Object.values(articleData);

        let insertSql = `INSERT INTO articles (${columns}) VALUES (${placeholders})`;

        db.query(insertSql, values, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: "Error duplicating article" });
          } else {
            res.json({
              msg: "Article duplicated successfully",
              newArticleId: result.insertId,
            });
          }
        });
      } else {
        res.send({ msg: "No data" });
      }
    }
  });
});

app.get("/toDelete", (req, res) => {
  let articleId = req.query.articleId;

  let sql = `DELETE FROM articles WHERE id = ` + articleId;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      res.json({
        msg: "Article deleted successfully",
      });
    }
  });
});

app.get("/searchWords", (req, res) => {
  let searchWords = req.query.searchWords;

  let sql =
    `select * from articles where articles.title like '%` + searchWords + `%'`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error fetching articles" });
    } else {
      res.json(result);
    }
  });
});
