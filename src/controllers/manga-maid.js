const baseURL = require("../lib/baseURL");
const cheerio = require("cheerio");
const header = require("../lib/header");
const cloudscraper = require("cloudscraper");

const projectUpdate = async (req, res) => {
  try {
    const url = await cloudscraper.get(`${baseURL}`, { headers: header });
    const $ = cheerio.load(url);
    const projects = [];
    $("body > main > div > div.container > div.flexbox3 > div").each(
      (i, el) => {
        projects.push({
          title: $(el).find("div > div > div > a").text(),
          banner: $(el)
            .find("div > a > div > img")
            .attr("src")
            ?.replace(/(\?|&)resize=\d+,\d+/, ""),
          chapter_updated: {
            chapter_title: $(el)
              .find("div > div > ul > li:nth-child(1) > a")
              .text(),
            time_updated: $(el)
              .find("div > div > ul > li:nth-child(1) > span")
              .text(),
          },
          manga_slug: $(el)
            .find("div > div > div > a")
            .attr("href")
            .replace(`${baseURL}`, "/"),
        });
      }
    );
    res.status(200).json({ status: "success", data: projects });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const lastUpdated = async (req, res) => {
  try {
    const url = await cloudscraper.get(
      `${baseURL}/page/${req.query.page || 1}`,
      {
        headers: header,
      }
    );
    const $ = cheerio.load(url);
    const lastUpdated = [];
    $("body > main > div > div.container > div.flexbox4 > div").each(
      (i, el) => {
        lastUpdated.push({
          title: $(el).find("div > div > div > a").text(),
          banner: $(el)
            .find("div > a > div > img")
            .attr("src")
            ?.replace(/(\?|&)resize=\d+,\d+/, ""),
          chapter_updated: {
            chapter_title: $(el)
              .find("div > div > ul > li:nth-child(1) > a")
              .text(),
            time_updated: $(el)
              .find("div > div > ul > li:nth-child(1) > span")
              .text(),
          },
          manga_slug: $(el)
            .find("div > div > div > a")
            .attr("href")
            .replace(`${baseURL}`, "/"),
        });
      }
    );
    const hasNext = $(
      "body > main > div > div.container > div.pagination > a.next.page-numbers"
    )
      .attr("href")
      ?.replace(baseURL, "/");
    const hasPrev = $(
      "body > main > div > div.container > div.pagination > a.prev.page-numbers"
    )
      .attr("href")
      ?.replace(baseURL, "/");

    res.status(200).json({
      status: "success",
      data: lastUpdated,
      hasNext: !!hasNext,
      hasPrev: !!hasPrev,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const mangaDetails = async (req, res) => {
  try {
    const url = await cloudscraper.get(
      `${baseURL}/manga/${req.params.mangaId}`,
      {
        headers: header,
      }
    );
    const $ = cheerio.load(url);

    const title = $(
      "body > main > div > div > div.container > div > div.series-flexright > div.series-title > h2"
    ).text();
    const banner = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-thumb > img"
    ).attr("src");
    const description = $(
      "body > main > div > div > div.container > div > div.series-flexright > div.series-synops > p"
    ).text();
    const type = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > div.series-infoz.block > span.type"
    ).text();
    const status = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > div.series-infoz.block > span.status"
    ).text();
    const genres = $(
      "body > main > div > div > div.container > div > div.series-flexright > div.series-genres > a"
    )
      .get()
      ?.map((el) => $(el).text());
    const rating = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > div.series-infoz.score > span:nth-child(2)"
    ).text();
    const bookmark_users = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > div.favcount > span"
    ).text();
    const published = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > ul > li:nth-child(1) > span"
    ).text();
    const author = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > ul > li:nth-child(2) > span"
    ).text();
    const total_chapter = $(
      "body > main > div > div > div.container > div > div.series-flexleft > div.series-info > ul > li:nth-child(3) > span"
    ).text();

    const chapter_list = [];

    $(
      "body > main > div > div > div.container > div > div.series-flexright > div.series-chapter > ul > li"
    ).each((i, el) => {
      chapter_list.push({
        chapter_title: $(el)
          .find("div > div.flexch-infoz > a > span")
          .contents()
          .first()
          .text()
          .trim(),
        chapter_slug: $(el)
          .find("div > div.flexch-infoz > a")
          .attr("href")
          .replace(`${baseURL}`, "/"),
        chapter_release: $(el)
          .find("div > div.flexch-infoz > a > span > span.date")
          .text(),
      });
    });

    res.status(200).json({
      status: "success",
      data: {
        title,
        banner,
        type,
        status,
        rating,
        description,
        genres,
        published,
        author,
        total_chapter,
        bookmark_users,
        chapter_list,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const mangaGenreList = async (req, res) => {
  try {
    const url = await cloudscraper.get(`${baseURL}/genre-list/`, {
      headers: header,
    });
    const $ = cheerio.load(url);
    const genre_list = [];
    $("body > main > div > div > ul > li").each((i, el) => {
      genre_list.push({
        genre_title: $(el).find("a").contents().first().text().trim(),
        genre_slug: $(el).find("a").attr("href")?.replace(`${baseURL}`, "/"),
        genre_length: $(el).find("a > span").text(),
      });
    });
    res.status(200).json({
      status: "success",
      data: genre_list,
      total_genres: genre_list.length,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const mangaByGenres = async (req, res) => {
  try {
    const url = await cloudscraper.get(
      `${baseURL}/genres/${req.params.genresId}`,
      {
        headers: header,
      }
    );
    const $ = cheerio.load(url);
    const manga_list = [];
    $("body > main > div > div > div.flexbox2 > div").each((i, el) => {
      manga_list.push({
        title: $(el).find("div > a > div > div > span.title").text(),
        banner: $(el)
          .find("div > a > div > img")
          .attr("src")
          ?.replace(/(\?|&)resize=\d+,\d+/, ""),
        rating: $(el).find("div > div > div.info > div.score").text()?.trim(),
        manga_slug: $(el)
          .find("div > a")
          .attr("href")
          ?.replace(`${baseURL}`, "/"),
      });
    });
    res.status(200).json({
      status: "success",
      data: manga_list,
      total_manga: manga_list.length,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const mangaByAdvSearch = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const queryParams = new URLSearchParams({
      title: req.query.title || "",
      author: req.query.author || "",
      yearx: req.query.genre || "",
      type: req.query.type || "",
      status: req.query.status || "",
      order: req.query.order || "",
    });

    const fullURL = `${baseURL}/advanced-search/${page}/?${queryParams.toString()}`;

    const html = await cloudscraper.get(fullURL, {
      headers: header,
    });

    const $ = cheerio.load(html);
    const manga = [];

    $("body > main > div > div > div.flexbox2 > div").each((i, el) => {
      manga.push({
        title: $(el).find("div > a > div > div > span.title").text().trim(),
        banner: $(el)
          .find("div > a > div > img")
          .attr("src")
          ?.replace(/(\?|&)resize=\d+,\d+/, ""),
        rating: $(el).find("div > div > div.info > div.score").text().trim(),
        manga_slug: $(el).find("div > a").attr("href")?.replace(baseURL, "/"),
      });
    });

    const has_next_href = $("a.next.page-numbers").attr("href");
    const has_prev_href = $("a.prev.page-numbers").attr("href");

    res.status(200).json({
      status: "success",
      data: manga,
      has_next: {
        has_next_link: has_next_href
          ? `/manga/search${has_next_href.replace(baseURL, "")}`
          : null,
        is_next_link: !!has_next_href,
      },
      has_prev: {
        has_prev_link: has_prev_href
          ? `/manga/search${has_prev_href.replace(baseURL, "")}`
          : null,
        is_prev_link: !!has_prev_href,
      },
      total_manga: manga.length,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const mangaChapter = async (req, res) => {
  try {
    const url = await cloudscraper.get(`${baseURL}/${req.params.chapterId}`, {
      headers: header,
    });
    const $ = cheerio.load(url);
    const chapter_list = [];
    $(
      "body > main > div.content > div.container > div.reader-area > p > a"
    ).each((i, el) => {
      chapter_list.push({
        chapter_image: $(el).find("img").attr("src"),
      });
    });
    const title = $("body > main > div.content > h2").text();
    const has_next = $("#chapnav > div > div.navigation > div.rightnav > a")
      .attr("href")
      ?.replace(baseURL, "/");
    const has_prev = $("#chapnav > div > div.navigation > div.leftnav > a")
      .attr("href")
      ?.replace(baseURL, "/");
    res.status(200).json({
      status: "success",
      title,
      data: chapter_list,
      has_next: {
        has_next_link: has_next ? `${has_next}` : null,
        is_next_link: !!has_next,
      },
      has_prev: {
        has_prev_link: has_prev ? `${has_prev}` : null,
        is_prev_link: !!has_prev,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const CheerioLoad = async (req, res) => {
  try {
    const url = await cloudscraper.get(`${baseURL}/${req.params.chapterId}`, {
      headers: header,
    });
    const $ = cheerio.load(url);
    const chapter_list = [];
    $(
      "body > main > div.content > div.container > div.reader-area > p > a"
    ).each((i, el) => {
      chapter_list.push({
        chapter_image: $(el).find("img").attr("src"),
      });
    });
    const title = $("body > main > div.content > h2").text();
    const has_next = $("#chapnav > div > div.navigation > div.rightnav > a")
      .attr("href")
      ?.replace(baseURL, "/");
    const has_prev = $("#chapnav > div > div.navigation > div.leftnav > a")
      .attr("href")
      ?.replace(baseURL, "/");
    res.status(200).json({
      status: "success",
      title,
      data: chapter_list,
      has_next: {
        has_next_link: has_next ? `${has_next}` : null,
        is_next_link: !!has_next,
      },
      has_prev: {
        has_prev_link: has_prev ? `${has_prev}` : null,
        is_prev_link: !!has_prev,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = {
  projectUpdate,
  lastUpdated,
  mangaDetails,
  mangaChapter,
  mangaGenreList,
  mangaByGenres,
  mangaByAdvSearch,
};
