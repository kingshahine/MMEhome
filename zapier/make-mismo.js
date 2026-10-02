// "Make MISMO" — Code by Zapier (JavaScript) step
//
// Zap layout:
//   1. Webhooks by Zapier  -> Catch Hook  (Bonzo "Make MISMO" action button posts here)
//   2. Code by Zapier      -> Run JavaScript  (paste this file; map Input Data fields below)
//   3. Microsoft OneDrive  -> Upload File
//        Folder:    /Team Masters
//        File:      {{2. xml}}
//        File Name: {{2. fileName}}
//
// Input Data keys to map from the Catch Hook step (leave any blank that Bonzo doesn't send):
//   firstName, lastName, email, phone, dob, ssn,
//   coFirstName, coLastName, coEmail, coPhone, coDob, coSsn,
//   street, city, state, zip,                         (current/residence address)
//   propStreet, propCity, propState, propZip,          (subject property; defaults to residence)
//   loanAmount, propertyValue, loanPurpose, loanType, rate, termMonths
//
// Output: { xml, fileName } — a MISMO 3.4 XML document.

const d = inputData || {};

const esc = (v) =>
  String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const has = (v) => v != null && String(v).trim() !== '';
const tag = (name, v) => (has(v) ? `<${name}>${esc(String(v).trim())}</${name}>` : '');
const digits = (v) => String(v || '').replace(/\D/g, '');
const money = (v) => (has(v) ? String(v).replace(/[^0-9.]/g, '') : '');

// Accepts 10/20/1948, 10-20-1948, 1948-10-20; returns YYYY-MM-DD
function isoDate(v) {
  if (!has(v)) return '';
  const s = String(v).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (m) {
    const y = m[3].length === 2 ? `19${m[3]}` : m[3];
    return `${y}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  }
  return '';
}

function purposeType(v) {
  const s = String(v || '').toLowerCase();
  if (s.includes('purchase')) return 'Purchase';
  if (s.includes('refi') || s.includes('cash') || s.includes('heloc')) return 'Refinance';
  return has(v) ? 'Other' : '';
}

function mortgageType(v) {
  const s = String(v || '').toLowerCase();
  if (s.includes('fha')) return 'FHA';
  if (s.includes('va')) return 'VA';
  if (s.includes('usda')) return 'USDARuralDevelopment';
  if (has(v)) return 'Conventional';
  return '';
}

function address(street, city, state, zip) {
  if (![street, city, state, zip].some(has)) return '';
  return `<ADDRESS>${tag('AddressLineText', street)}${tag('CityName', city)}${tag('PostalCode', zip)}${tag('StateCode', state)}</ADDRESS>`;
}

function borrowerParty(seq, b) {
  const ssn = digits(b.ssn);
  const phone = digits(b.phone);
  const contacts = [
    has(b.email) ? `<CONTACT_POINT><CONTACT_POINT_EMAIL>${tag('ContactPointEmailValue', b.email)}</CONTACT_POINT_EMAIL></CONTACT_POINT>` : '',
    phone ? `<CONTACT_POINT><CONTACT_POINT_TELEPHONE>${tag('ContactPointTelephoneValue', phone)}</CONTACT_POINT_TELEPHONE></CONTACT_POINT>` : '',
  ].join('');
  const residence = address(d.street, d.city, d.state, d.zip);
  return `
        <PARTY SequenceNumber="${seq}" xlink:label="PARTY_BORROWER_${seq}">
          <INDIVIDUAL>
            ${contacts ? `<CONTACT_POINTS>${contacts}</CONTACT_POINTS>` : ''}
            <NAME>${tag('FirstName', b.first)}${tag('LastName', b.last)}</NAME>
          </INDIVIDUAL>
          <ROLES>
            <ROLE SequenceNumber="1">
              <BORROWER>
                <BORROWER_DETAIL>${tag('BorrowerBirthDate', isoDate(b.dob))}<BorrowerClassificationType>${seq === 1 ? 'Primary' : 'Secondary'}</BorrowerClassificationType></BORROWER_DETAIL>
                ${residence ? `<RESIDENCES><RESIDENCE>${residence}<RESIDENCE_DETAIL><BorrowerResidencyType>Current</BorrowerResidencyType></RESIDENCE_DETAIL></RESIDENCE></RESIDENCES>` : ''}
              </BORROWER>
              <ROLE_DETAIL><PartyRoleType>Borrower</PartyRoleType></ROLE_DETAIL>
            </ROLE>
          </ROLES>
          ${ssn.length === 9 ? `<TAXPAYER_IDENTIFIERS><TAXPAYER_IDENTIFIER><TaxpayerIdentifierType>SocialSecurityNumber</TaxpayerIdentifierType><TaxpayerIdentifierValue>${ssn}</TaxpayerIdentifierValue></TAXPAYER_IDENTIFIER></TAXPAYER_IDENTIFIERS>` : ''}
        </PARTY>`;
}

const borrowers = [
  { first: d.firstName, last: d.lastName, email: d.email, phone: d.phone, dob: d.dob, ssn: d.ssn },
];
if (has(d.coFirstName) || has(d.coLastName)) {
  borrowers.push({ first: d.coFirstName, last: d.coLastName, email: d.coEmail, phone: d.coPhone, dob: d.coDob, ssn: d.coSsn });
}

const subject =
  address(d.propStreet, d.propCity, d.propState, d.propZip) ||
  address(d.street, d.city, d.state, d.zip);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<MESSAGE xmlns="http://www.mismo.org/residential/2009/schemas" xmlns:xlink="http://www.w3.org/1999/xlink" MISMOReferenceModelIdentifier="3.4.032420160128">
  <ABOUT_VERSIONS>
    <ABOUT_VERSION><CreatedDatetime>${new Date().toISOString()}</CreatedDatetime><DataVersionName>Bonzo Make MISMO</DataVersionName></ABOUT_VERSION>
  </ABOUT_VERSIONS>
  <DEAL_SETS><DEAL_SET><DEALS><DEAL>
    <COLLATERALS><COLLATERAL><SUBJECT_PROPERTY>
      ${subject}
      ${has(d.propertyValue) ? `<PROPERTY_DETAIL>${tag('PropertyEstimatedValueAmount', money(d.propertyValue))}</PROPERTY_DETAIL>` : ''}
    </SUBJECT_PROPERTY></COLLATERAL></COLLATERALS>
    <LOANS><LOAN LoanRoleType="SubjectLoan">
      ${has(d.termMonths) ? `<MATURITY><MATURITY_RULE>${tag('LoanMaturityPeriodCount', digits(d.termMonths))}<LoanMaturityPeriodType>Month</LoanMaturityPeriodType></MATURITY_RULE></MATURITY>` : ''}
      <TERMS_OF_LOAN>${tag('BaseLoanAmount', money(d.loanAmount))}${tag('LoanPurposeType', purposeType(d.loanPurpose))}${tag('MortgageType', mortgageType(d.loanType))}${tag('NoteRatePercent', money(d.rate))}</TERMS_OF_LOAN>
    </LOAN></LOANS>
    <PARTIES>${borrowers.map((b, i) => borrowerParty(i + 1, b)).join('')}
    </PARTIES>
  </DEAL></DEALS></DEAL_SET></DEAL_SETS>
</MESSAGE>`
  .replace(/\n\s*\n/g, '\n');

const safe = (s) => String(s || '').trim().replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
const stamp = new Date().toISOString().slice(0, 10);
const fileName = `${safe(d.lastName) || 'Borrower'}_${safe(d.firstName)}_MISMO_${stamp}.xml`.replace(/__+/g, '_');

output = { xml, fileName };
