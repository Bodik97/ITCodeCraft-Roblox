/**
 * Google Apps Script для таблиці лідів.
 * Після змін коду: Deploy → Manage deployments → Edit (✏️) → Version: New → Deploy.
 * Кнопка «Запустити» лише тестує функцію в редакторі, сайт використовує URL deployment.
 */
var SPREADSHEET_ID = "1nJCP4Mpk7wsQfgVoIZEwlb0oxbZUtwEb6QdwNQcKF7w";
var SHEET_NAME = "Ліди 🪭";
var RATE_MS = 2000;

var HEADERS = [
  "Course",
  "FormID",
  "SiteURL",
  "childAge",
  "email",
  "name",
  "phone",
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: "no-payload" });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonOut({ ok: false, error: "invalid-json" });
    }

    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000);
    } catch (err) {
      return jsonOut({ ok: false, error: "lock-timeout" });
    }

    try {
      var cache = CacheService.getScriptCache();
      var dedupeKey =
        "lead:" +
        String(data.phone || data.email || "")
          .replace(/\s+/g, "")
          .toLowerCase();
      if (dedupeKey !== "lead:" && cache.get(dedupeKey)) {
        return jsonOut({ ok: false, error: "duplicate" });
      }

      var sheet = getOrCreateSheet();

      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
        sheet.setFrozenRows(1);
        sheet.autoResizeColumns(1, HEADERS.length);
      }

      var row = [
        safe(data.Course),
        safe(data.FormID),
        safe(data.SiteURL),
        getChildAge(data),
        safe(data.email),
        safe(data.name),
        safe(data.phone),
      ];

      sheet.appendRow(row);

      if (dedupeKey !== "lead:") {
        cache.put(dedupeKey, "1", Math.max(1, Math.ceil(RATE_MS / 1000)));
      }

      return jsonOut({ ok: true });
    } finally {
      try {
        lock.releaseLock();
      } catch (_) {}
    }
  } catch (err) {
    console.error(err);
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonOut({ ok: true, status: "alive" });
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function getChildAge(data) {
  var age = data.childAge;
  if (age === undefined || age === null || age === "") {
    age = data.child_age;
  }
  if (age === undefined || age === null || age === "") {
    return "";
  }
  return String(age);
}

/** Запустіть у редакторі Apps Script, щоб перевірити запис (не оновлює Web App). */
function testLeadRow() {
  doPost({
    postData: {
      contents: JSON.stringify({
        Course: "Roblox Studio для дітей 8–15 років",
        FormID: "roblox-landing",
        SiteURL: "https://example.com/",
        childAge: 11,
        email: "",
        name: "test",
        phone: "+380966918999",
      }),
    },
  });
}

function safe(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (_) {
      return String(value);
    }
  }
  return String(value);
}

function jsonOut(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
