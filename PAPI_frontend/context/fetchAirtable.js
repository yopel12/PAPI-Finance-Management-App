import axios from 'axios';

const AIRTABLE_API_KEY = 'patAOiSqAbSJe5qtl.b92b8020f3a702886431f9df7ffb8661f298b3f99c6c7623ce801a7a118a8998';
const BASE_ID         = 'apphaU4uHdOAF03V1';
const TABLE_NAME      = 'Daily';

// make sure this matches your Airtable field exactly (including spaces/case)
const CATEGORY_FIELD = 'FS Category';
const AMOUNT_FIELD   = 'amount';
const DESC_FIELD     = 'description';
const DATE_FIELD     = 'date';

export async function fetchCategoryDetails(category) {
  try {
    // filterByFormula only returns rows where LOWER({FS Category}) = 'income' (or expense, etc.)
    const filter = encodeURIComponent(
      `LOWER({${CATEGORY_FIELD}})='${category.toLowerCase()}'`
    );
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${filter}`;

    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });
    return resp.data.records; // [ { id, fields: { ... } }, … ]
  } catch (err) {
    console.error('Airtable fetch error:', err);
    return [];
  }
}
