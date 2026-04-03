import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // --- Hedgerow Rules ---
  const hedgerowData: [string, number, string | null, string | null, string | null, string | null, string][] = [
    ['Remove hedgerow', 1, 'Under 20m for new field access gate; making opening required by planning permission; required by DEFRA for plant health', 'Assessed under Schedule 1 of Hedgerow Regulations 1997: over 30 years old and meets wildlife, historical, or landscape criteria', 'Up to 25,000 GBP fine for unlawful removal plus remediation order requiring replanting', 'Hedgerow Regulations 1997 s.2-s.5', 'GB'],
    ['Remove hedgerow (important)', 1, 'Planning permission for development; DEFRA plant health order', 'Over 30 years old plus meets at least one Schedule 1 criterion: supports protected species, recorded in parish boundary records, includes archaeological features, or marks a pre-1850 boundary', 'Up to 25,000 GBP fine plus remediation order', 'Hedgerow Regulations 1997 Schedule 1', 'GB'],
    ['Remove hedgerow (notice)', 1, '42-day notice to local planning authority required before removal. LPA may issue hedgerow retention notice within 42 days if hedgerow is important.', null, 'Removal without notice: up to 25,000 GBP fine', 'Hedgerow Regulations 1997 s.2', 'GB'],
    ['Trim hedgerow', 0, null, null, 'Cross-compliance breach if trimmed during bird nesting season (1 March to 31 August) under GAEC 7a', 'Cross-compliance GAEC 7a', 'GB'],
    ['Lay hedgerow', 0, 'Traditional management practice; no notice needed. Best done October to March.', null, null, 'Good practice guidance', 'GB'],
    ['Coppice hedgerow', 0, 'Traditional management practice; no notice needed.', null, null, 'Good practice guidance', 'GB'],
    ['Replace hedgerow', 0, 'If removed with permission, replacement planting may be conditioned by local planning authority', null, null, 'Hedgerow Regulations 1997 s.5', 'GB'],
    ['Hedgerow buffer width', 0, 'Cross-compliance requires 2m buffer strip from centre of hedge. Cannot cultivate or apply pesticides/fertiliser within buffer.', null, 'Cross-compliance breach penalties apply', 'Cross-compliance GAEC 7a', 'GB'],
  ];

  for (const [action, notice, exemptions, criteria, penalties, ref, jur] of hedgerowData) {
    db.run(
      `INSERT INTO hedgerow_rules (action, notice_required, exemptions, important_hedgerow_criteria, penalties, regulation_ref, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [action, notice, exemptions, criteria, penalties, ref, jur]
    );
  }

  // --- Felling Rules ---
  const fellingData: [string, number, number | null, number | null, string | null, string | null, string | null, string | null, string][] = [
    ['Standard felling', 1, 5, null, null, 'Apply to Forestry Commission. 8-week determination period. Replanting conditions normally attached. Licence valid for up to 5 years.', 'Up to 2,500 GBP or twice the value of the trees, whichever is greater', 'Forestry Act 1967 s.9', 'GB'],
    ['Small exemption (no licence)', 0, 5, null, 'Up to 5 cubic metres per calendar quarter without licence. Maximum 2 cubic metres may be sold.', null, null, 'Forestry Act 1967 s.9(2)', 'GB'],
    ['TPO trees', 1, null, null, 'Separate consent from local planning authority, not Forestry Commission. TPO makes it an offence to cut down, top, lop, uproot, wilfully damage or destroy a protected tree.', 'Apply to local planning authority under Town and Country Planning Act 1990.', 'Unlimited fine in Crown Court', 'Town and Country Planning Act 1990 s.210', 'GB'],
    ['Planning permission trees', 0, null, null, 'Trees covered by an existing planning consent do not need a separate felling licence.', null, null, 'Forestry Act 1967 s.9(4)(a)', 'GB'],
    ['Dangerous trees (emergency)', 0, null, null, 'Emergency felling exempt from licence. Must notify Forestry Commission within 5 working days. Replanting obligation still applies.', null, null, 'Forestry Act 1967 s.9(4)(b)', 'GB'],
    ['Fruit trees', 0, null, null, 'Orchard and fruit trees exempt from felling licence requirements.', null, null, 'Forestry Act 1967 s.9(3)', 'GB'],
    ['Garden trees (under 0.1ha)', 0, null, 0.1, 'Trees in a garden under 0.1 hectares are exempt from felling licence.', null, null, 'Forestry Act 1967 s.9(2)', 'GB'],
    ['Approved development', 0, null, null, 'Felling required to carry out development authorised by planning permission is exempt.', null, null, 'Forestry Act 1967 s.9(4)(a)', 'GB'],
    ['Felling application process', 1, null, null, null, 'Apply online via Forestry Commission portal or Form FC1. Include species, volume, area, map. 8-week statutory determination period. Conditions typically include replanting within 2 years with specified species.', null, 'Forestry Act 1967 s.10', 'GB'],
    ['Felling penalties', 1, null, null, null, null, 'Up to 2,500 GBP per offence or twice value of trees (whichever greater). Court may also order replanting.', 'Forestry Act 1967 s.17', 'GB'],
  ];

  for (const [scenario, lic, m3, ha, exemptions, process, penalties, ref, jur] of fellingData) {
    db.run(
      `INSERT INTO felling_rules (scenario, licence_required, threshold_m3, threshold_ha, exemptions, application_process, penalties, regulation_ref, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [scenario, lic, m3, ha, exemptions, process, penalties, ref, jur]
    );
  }

  // --- SSSI Operations ---
  const sssiData: [string, number, string, string | null, string, string][] = [
    ['Grazing changes', 1, 'Apply to Natural England. 28-day response period. May attach conditions on stocking rates, seasonal restrictions, or grazing methods.', 'Maximum stocking rate limits, seasonal grazing restrictions, species-specific exclusions', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration costs', 'GB'],
    ['Drainage works', 1, 'Apply to Natural England. 28-day response. Consent rarely given for new drainage on SSSIs. Modification of existing drainage may be permitted with conditions.', 'Water level monitoring, seasonal restrictions, engineering specifications', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['Fertiliser application', 1, 'Apply to Natural England. 28-day response. Usually restricted on nutrient-sensitive habitats (chalk grassland, heathland, wetlands).', 'Application rate limits, exclusion zones around sensitive features, timing restrictions', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['Pesticide application', 1, 'Apply to Natural England. 28-day response. Consent depends on proximity to sensitive habitats and species present.', 'Product restrictions, buffer zones, timing restrictions to protect nesting/breeding', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['Planting trees or shrubs', 1, 'Apply to Natural England. 28-day response. Consent depends on existing habitat value and planting impact on SSSI features.', 'Species restrictions, planting density limits, exclusion zones around sensitive features', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['Construction (buildings, tracks, fencing)', 1, 'Apply to Natural England. 28-day response. Major construction rarely consented. Minor works (fencing for grazing management) more likely to be approved.', 'Design specifications, materials restrictions, seasonal construction windows, reinstatement conditions', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['Managed burning', 1, 'Apply to Natural England. 28-day response. Burning on SSSIs requires consent even during the legal burning season.', 'Burning rotation plans, fire break requirements, wind speed limits, exclusion zones', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['Mineral or soil extraction', 1, 'Apply to Natural England. 28-day response. Extraction on SSSIs is strongly resisted. Planning permission also required.', 'Volume limits, phased extraction, restoration plans, monitoring requirements', 'Up to 20,000 GBP (magistrates) or unlimited fine (Crown Court) plus restoration', 'GB'],
    ['SSSI appeal process', 1, 'If Natural England refuses consent or attaches unacceptable conditions, appeal to the Secretary of State. Alternatively, apply to do the operation and if refused, may claim compensation for financial loss.', null, null, 'GB'],
  ];

  for (const [op, consent, process, conditions, penalties, jur] of sssiData) {
    db.run(
      `INSERT INTO sssi_operations (operation, consent_required, process, typical_conditions, penalties, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [op, consent, process, conditions, penalties, jur]
    );
  }

  // --- Rights of Way ---
  const rowData: [string, string, number, string | null, string, string, string][] = [
    ['Footpath', 'Minimum width, reinstatement after disturbance, surface must be apparent to users', 1.0, 'Cannot grow crops on surface of cross-field path. Must make path line apparent. Field-edge paths: 1m minimum. Cross-field paths: 1.5m minimum.', 'Must reinstate within 14 days of disturbance. 24 hours for first disturbance if crop is already growing on a cross-field path.', 'Criminal offence to obstruct. Local authority has power to remove obstruction and charge landowner costs.', 'GB'],
    ['Bridleway', 'Minimum width, reinstatement after disturbance, suitable for horse riders and cyclists', 2.0, 'Cannot grow crops on surface of cross-field path. Field-edge: 2m minimum. Cross-field: 3m minimum. Surface must be passable on horseback.', 'Must reinstate within 14 days of disturbance. 24 hours for first disturbance if crop already growing.', 'Criminal offence to obstruct. Local authority enforcement. Surface must be safe for horses.', 'GB'],
    ['Restricted byway', 'Minimum width, no motor vehicles, suitable for walkers, horse riders, and non-motorised vehicles', 3.0, 'Cannot obstruct or narrow below minimum width. Available for walkers, horse riders, cyclists, and horse-drawn vehicles but not motor vehicles.', 'Must reinstate within 14 days of disturbance.', 'Criminal offence to obstruct. Higher enforcement priority due to broader usage rights.', 'GB'],
    ['Byway open to all traffic (BOAT)', 'Minimum width, motor vehicles permitted, must maintain surface for all users', 5.0, 'Open to all traffic including motor vehicles. Cannot obstruct or narrow. Surface must support vehicular use.', 'Must reinstate within 14 days of disturbance.', 'Criminal offence to obstruct. Motor vehicle access means highway authority enforcement.', 'GB'],
    ['Ploughing (cross-field paths)', 'May plough cross-field footpaths and bridleways but must reinstate', 1.5, 'Can plough cross-field paths (not field-edge). Must reinstate to minimum width within 14 days. 24 hours if path has already been ploughed once that season.', '14 days for first ploughing. 24 hours if already disturbed once in the same crop season.', 'Failure to reinstate is criminal offence. Local authority may reinstate and recover costs.', 'GB'],
    ['Gates and stiles', 'Landowner must maintain in good repair. Gates preferred over stiles for accessibility.', 0, 'Landowner responsible for maintenance. Gate preferred over stile (Equality Act accessibility). Must not add new barriers without local authority permission. Self-closing gates acceptable.', null, 'Local authority can serve notice requiring repair. Failure to comply is offence.', 'GB'],
    ['Crops on paths', 'Cannot inconvenience users by growing crops on path surface', 1.5, 'Cannot allow crop to grow on surface of any cross-field public right of way so as to inconvenience users. Must make path line apparent to users. Applies to all growing crops including grass re-seeds on cross-field paths.', null, 'Criminal offence. Fixed penalty notice or prosecution. Local authority may clear and recover costs.', 'GB'],
  ];

  for (const [pathType, obligation, width, cropping, reinstatement, obstruction, jur] of rowData) {
    db.run(
      `INSERT INTO rights_of_way (path_type, obligation, min_width_m, cropping_rules, reinstatement_deadline, obstruction_liability, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pathType, obligation, width, cropping, reinstatement, obstruction, jur]
    );
  }

  // --- Common Land Rules ---
  const commonData: [string, number, string, string, string][] = [
    ['Fencing', 1, 'DEFRA (s.38 Commons Act 2006) or local authority (s.194 Law of Property Act 1925)', 'Apply to DEFRA for consent under s.38 Commons Act 2006. Application must demonstrate public benefit or necessity for land management. Alternatively, for commons in former metropolitan areas, apply to local authority under s.194 LPA 1925.', 'GB'],
    ['Building or construction', 1, 'DEFRA (s.38 Commons Act 2006) or local authority', 'Generally prohibited without consent. Any permanent structure requires s.38 consent. Planning permission alone is not sufficient. Both s.38 consent and planning permission are needed.', 'GB'],
    ['Driving vehicles', 1, 'Landowner or commons council', 'No driving on common land without lawful authority. Exception: commoners exercising registered rights. Emergency vehicles exempt. Access for land management may require explicit agreement.', 'GB'],
    ['Public access for recreation', 0, 'Automatic right under CRoW Act 2000', 'Automatic right of access on foot for recreation under Countryside and Rights of Way Act 2000 s.2. Applies to all registered common land in England and Wales. Dogs must be on leads near livestock.', 'GB'],
    ['Agricultural works', 1, 'DEFRA (s.38 Commons Act 2006)', 'Consent required for any permanent works affecting common land. Temporary agricultural operations (hay-making, stock movements) by commoners exercising rights do not need consent.', 'GB'],
  ];

  for (const [activity, consent, authority, process, jur] of commonData) {
    db.run(
      `INSERT INTO common_land_rules (activity, consent_required, consent_authority, process, jurisdiction)
       VALUES (?, ?, ?, ?, ?)`,
      [activity, consent, authority, process, jur]
    );
  }

  // --- Planting Guidance ---
  const plantingData: [string, string, number | null, number, string, number, string][] = [
    ['Woodland creation', 'Broadleaf', 1.0, 1, 'EWCO rate approximately 8,500 GBP/ha for broadleaf woodland creation. Additional payments for public access, nature recovery, and water quality benefits.', 15, 'GB'],
    ['Woodland creation', 'Conifer', 1.0, 1, 'EWCO rate approximately 6,800 GBP/ha for conifer planting. Lower rate reflects faster establishment. Additional payments available for public access.', 15, 'GB'],
    ['Agroforestry', 'Mixed', 0.5, 0, 'SFI agroforestry options available (not EWCO). Silvoarable and silvopasture integrated with farming systems. Payment rates vary by option.', 15, 'GB'],
    ['Riparian planting', 'Broadleaf', null, 0, 'Grant available under Countryside Stewardship Water Capital items. No EIA required for narrow riparian strips. Focus on native broadleaf species for bank stabilisation and shade.', 15, 'GB'],
    ['Ancient woodland buffer', 'Native broadleaf', null, 0, '15m buffer required for any new planting adjacent to ancient woodland. Buffer must use native species compatible with adjacent ancient woodland type. No non-native species within buffer.', 15, 'GB'],
    ['Community woodland', 'Mixed', 0.5, 1, 'Higher EWCO contribution for woodlands with dedicated public access. Additional approximately 2,800 GBP/ha for full public access. Must provide maintained paths and access points.', 15, 'GB'],
  ];

  for (const [purpose, species, minArea, eia, grant, buffer, jur] of plantingData) {
    db.run(
      `INSERT INTO planting_guidance (purpose, species_group, min_area_ha, eia_screening_required, grant_available, ancient_woodland_buffer_m, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [purpose, species, minArea, eia, grant, buffer, jur]
    );
  }

  // --- FTS5 Search Index ---
  const ftsData: [string, string, string, string][] = [
    ['Hedgerow removal notice', 'Under the Hedgerow Regulations 1997, removing a hedgerow requires 42 days notice to the local planning authority. The LPA may issue a hedgerow retention notice if the hedgerow is classified as important under Schedule 1.', 'hedgerow', 'GB'],
    ['Important hedgerow criteria', 'A hedgerow is classified as important if it is over 30 years old and meets at least one Schedule 1 criterion: supports protected species, recorded in parish boundary records, includes archaeological features, or marks a pre-1850 boundary.', 'hedgerow', 'GB'],
    ['Hedgerow trimming season', 'Hedgerow trimming should not take place during bird nesting season (1 March to 31 August) under cross-compliance GAEC 7a. No notice is needed for trimming outside nesting season.', 'hedgerow', 'GB'],
    ['Hedgerow penalties', 'Unlawful hedgerow removal carries a fine of up to 25,000 GBP plus a remediation order requiring replanting. A 2m buffer from the centre of the hedge must be maintained under cross-compliance.', 'hedgerow', 'GB'],
    ['Felling licence threshold', 'A felling licence from the Forestry Commission is required when felling more than 5 cubic metres of timber in any calendar quarter. Up to 2 cubic metres of the 5 m3 exemption may be sold.', 'felling', 'GB'],
    ['Felling licence application', 'Apply to the Forestry Commission online or via Form FC1. Statutory determination period is 8 weeks. Replanting conditions are normally attached, requiring replanting within 2 years with specified species.', 'felling', 'GB'],
    ['Felling exemptions', 'Exempt from felling licence: fruit trees, garden trees (under 0.1ha), trees covered by planning permission, dangerous trees (notify FC within 5 days). TPO trees need separate local authority consent.', 'felling', 'GB'],
    ['Felling penalties', 'Felling without a licence carries a fine of up to 2,500 GBP or twice the value of the trees, whichever is greater. Court may also order replanting.', 'felling', 'GB'],
    ['SSSI consent requirement', 'Any operation listed on the SSSI notification requires consent from Natural England before it can be carried out. Natural England has 28 days to respond. Operations include grazing changes, drainage, fertiliser application, burning, and construction.', 'sssi', 'GB'],
    ['SSSI penalties', 'Carrying out operations on an SSSI without Natural England consent: up to 20,000 GBP fine in magistrates court or unlimited fine in Crown Court, plus restoration costs.', 'sssi', 'GB'],
    ['SSSI appeal', 'If Natural England refuses consent or attaches unacceptable conditions, the owner can appeal to the Secretary of State. Compensation may be claimed for financial loss caused by refusal.', 'sssi', 'GB'],
    ['Footpath width and reinstatement', 'Public footpaths: minimum 1m wide (field edge) or 1.5m (cross-field). Must reinstate within 14 days of disturbance. 24 hours if crop already growing on a cross-field path. Cannot grow crops on the path surface.', 'rights_of_way', 'GB'],
    ['Bridleway width and reinstatement', 'Public bridleways: minimum 2m wide (field edge) or 3m (cross-field). Must reinstate within 14 days. Same 24-hour rule for subsequent disturbance. Surface must be passable on horseback.', 'rights_of_way', 'GB'],
    ['Public right of way obstruction', 'Obstructing a public right of way is a criminal offence. The local authority has power to remove obstructions and charge the landowner. Gates and stiles must be maintained in good repair. Gates preferred over stiles for accessibility.', 'rights_of_way', 'GB'],
    ['Ploughing cross-field paths', 'Landowners may plough cross-field footpaths and bridleways but must reinstate within 14 days. If the path has already been disturbed once that season, reinstatement must be within 24 hours.', 'rights_of_way', 'GB'],
    ['Common land fencing', 'Fencing on common land requires consent from DEFRA under s.38 Commons Act 2006 or from the local authority under s.194 Law of Property Act 1925. Fencing without consent is unlawful.', 'common_land', 'GB'],
    ['Common land public access', 'All registered common land in England and Wales has automatic right of public access on foot for recreation under the Countryside and Rights of Way Act 2000 s.2.', 'common_land', 'GB'],
    ['Woodland creation grants EWCO', 'England Woodland Creation Offer: approximately 8,500 GBP/ha for broadleaf, 6,800 GBP/ha for conifer. Additional 2,800 GBP/ha for public access. EIA screening required if over 5 hectares on semi-natural habitat.', 'planting', 'GB'],
    ['Ancient woodland buffer', 'A 15-metre buffer of native species is required for any new planting adjacent to ancient woodland. No non-native species may be planted within the buffer zone.', 'planting', 'GB'],
    ['EIA screening for woodland planting', 'Environmental Impact Assessment screening under the EIA (Forestry) Regulations 1999 is required for new woodland planting over 5 hectares on semi-natural habitat, or for planting in sensitive areas regardless of size.', 'planting', 'GB'],
  ];

  for (const [title, body, topic, jur] of ftsData) {
    db.run(
      `INSERT INTO search_index (title, body, topic, jurisdiction) VALUES (?, ?, ?, ?)`,
      [title, body, topic, jur]
    );
  }

  // --- Metadata ---
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', '2026-04-03')", []);
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', '2026-04-03')", []);

  return db;
}
