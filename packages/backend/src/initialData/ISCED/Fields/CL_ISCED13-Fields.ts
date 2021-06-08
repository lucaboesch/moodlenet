type Basic_ISCED_Field = { code: string; desc: string }
const fields = _csv().filter(field => field.code.match(/^F\d{2,4}$/))

export default fields
function _csv(): Basic_ISCED_Field[] {
  return [
    { code: 'F00', desc: `Generic programmes and qualifications` },
    { code: 'F000', desc: `Generic programmes and qualifications not further defined` },
    { code: 'F0000', desc: `Generic programmes and qualifications not further defined` },
    { code: 'F001', desc: `Basic programmes and qualifications` },
    { code: 'F0011', desc: `Basic programmes and qualifications` },
    { code: 'F002', desc: `Literacy and numeracy` },
    { code: 'F0021', desc: `Literacy and numeracy` },
    { code: 'F003', desc: `Personal skills and development` },
    { code: 'F0031', desc: `Personal skills and development` },
    { code: 'F009', desc: `Generic programmes and qualifications not elsewhere classified` },
    { code: 'F0099', desc: `Generic programmes and qualifications not elsewhere classified` },
    { code: 'F01', desc: `Education` },
    { code: 'F011', desc: `Education` },
    { code: 'F0110', desc: `Education not further defined` },
    { code: 'F0111', desc: `Education science` },
    { code: 'F0112', desc: `Training for pre-school teachers` },
    { code: 'F0113_0114', desc: `Teacher trainigng without and with subject specialisation` },
    { code: 'F0113', desc: `Teacher training without subject specialisation` },
    { code: 'F0114', desc: `Teacher training with subject specialisation` },
    { code: 'F0119', desc: `Education not elsewhere classified` },
    { code: 'F018', desc: `Inter-disciplinary programmes and qualifications involving education` },
    { code: 'F0188', desc: `Inter-disciplinary programmes and qualifications involving education` },
    { code: 'F02', desc: `Arts and humanities` },
    { code: 'F020', desc: `Arts and humanities not further defined` },
    { code: 'F0200', desc: `Arts and humanities not further defined` },
    { code: 'F021', desc: `Arts` },
    { code: 'F0210', desc: `Arts not further defined` },
    { code: 'F0211', desc: `Audio-visual techniques and media production` },
    { code: 'F0212', desc: `Fashion, interior and industrial design` },
    { code: 'F0213', desc: `Fine arts` },
    { code: 'F0214', desc: `Handicrafts` },
    { code: 'F0215', desc: `Music and performing arts` },
    { code: 'F0219', desc: `Arts not elsewhere classified` },
    { code: 'F022_F023', desc: `Humanities` },
    { code: 'F022', desc: `Humanities (except languages)` },
    { code: 'F0220', desc: `Humanities (except languages) not further defined` },
    { code: 'F0221', desc: `Religion and theology` },
    { code: 'F0222', desc: `History and archaeology` },
    { code: 'F0223', desc: `Philosophy and ethics` },
    { code: 'F0229', desc: `Humanities (except languages) not elsewhere classified` },
    { code: 'F023', desc: `Languages` },
    { code: 'F0230', desc: `Languages not further defined` },
    { code: 'F0231', desc: `Language acquisition` },
    { code: 'F0232', desc: `Literature and linguistics` },
    { code: 'F0239', desc: `Languages not elsewhere classified` },
    { code: 'F028', desc: `Inter-disciplinary programmes and qualifications involving arts and humanities` },
    { code: 'F0288', desc: `Inter-disciplinary programmes and qualifications involving arts and humanities` },
    { code: 'F029', desc: `Arts and humanities not elsewhere classified` },
    { code: 'F0299', desc: `Arts and humanities not elsewhere classified` },
    { code: 'F03_04', desc: `Social sciences, journalism, information, business, administration and law` },
    { code: 'F03', desc: `Social sciences, journalism and information` },
    { code: 'F030', desc: `Social sciences, journalism and information not further defined` },
    { code: 'F0300', desc: `Social sciences, journalism and information not further defined` },
    { code: 'F031', desc: `Social and behavioural sciences` },
    { code: 'F0310', desc: `Social and behavioural sciences not further defined` },
    { code: 'F0311', desc: `Economics` },
    { code: 'F0312', desc: `Political sciences and civics` },
    { code: 'F0313', desc: `Psychology` },
    { code: 'F0314', desc: `Sociology and cultural studies` },
    { code: 'F0319', desc: `Social and behavioural sciences not elsewhere classified` },
    { code: 'F032', desc: `Journalism and information` },
    { code: 'F0320', desc: `Journalism and information not further defined` },
    { code: 'F0321', desc: `Journalism and reporting` },
    { code: 'F0322', desc: `Library, information and archival studies` },
    { code: 'F0329', desc: `Journalism and information not elsewhere classified` },
    {
      code: 'F038',
      desc: `Inter-disciplinary programmes and qualifications involving social sciences, journalism and information`,
    },
    {
      code: 'F0388',
      desc: `Inter-disciplinary programmes and qualifications involving social sciences, journalism and information`,
    },
    { code: 'F039', desc: `Social sciences, journalism and information not elsewhere classified` },
    { code: 'F0399', desc: `Social sciences, journalism and information not elsewhere classified` },
    { code: 'F04', desc: `Business, administration and law` },
    { code: 'F040', desc: `Business, administration and law not further defined` },
    { code: 'F0400', desc: `Business, administration and law not further defined` },
    { code: 'F041', desc: `Business and administration` },
    { code: 'F0410', desc: `Business and administration not further defined` },
    { code: 'F0411', desc: `Accounting and taxation` },
    { code: 'F0412', desc: `Finance, banking and insurance` },
    { code: 'F0413', desc: `Management and administration` },
    { code: 'F0414', desc: `Marketing and advertising` },
    { code: 'F0415', desc: `Secretarial and office work` },
    { code: 'F0416', desc: `Wholesale and retail sales` },
    { code: 'F0417', desc: `Work skills` },
    { code: 'F0419', desc: `Business and administration not elsewhere classified` },
    { code: 'F042', desc: `Law` },
    { code: 'F0421', desc: `Law` },
    {
      code: 'F048',
      desc: `Inter-disciplinary programmes and qualifications involving business, administration and law`,
    },
    {
      code: 'F0488',
      desc: `Inter-disciplinary programmes and qualifications involving business, administration and law`,
    },
    { code: 'F049', desc: `Business, administration and law not elsewhere classified` },
    { code: 'F0499', desc: `Business, administration and law not elsewhere classified` },
    { code: 'F05', desc: `Natural sciences, mathematics and statistics` },
    { code: 'F050', desc: `Natural sciences, mathematics and statistics not further defined` },
    { code: 'F0500', desc: `Natural sciences, mathematics and statistics not further defined` },
    { code: 'F051', desc: `Biological and related sciences` },
    { code: 'F0510', desc: `Biological and related sciences not further defined` },
    { code: 'F0511_0512', desc: `Biology and biochemistry` },
    { code: 'F0511', desc: `Biology` },
    { code: 'F0512', desc: `Biochemistry` },
    { code: 'F0519', desc: `Biological and related sciences not elsewhere classified` },
    { code: 'F052', desc: `Environment` },
    { code: 'F0520', desc: `Environment not further defined` },
    { code: 'F0521', desc: `Environmental sciences` },
    { code: 'F0522', desc: `Natural environments and wildlife` },
    { code: 'F0529', desc: `Environment not elsewhere classified` },
    { code: 'F053', desc: `Physical sciences` },
    { code: 'F0530', desc: `Physical sciences not further defined` },
    { code: 'F0531', desc: `Chemistry` },
    { code: 'F0532', desc: `Earth sciences` },
    { code: 'F0533', desc: `Physics` },
    { code: 'F0539', desc: `Physical sciences not elsewhere classified` },
    { code: 'F054', desc: `Mathematics and statistics` },
    { code: 'F0540', desc: `Mathematics and statistics not further defined` },
    { code: 'F0541', desc: `Mathematics` },
    { code: 'F0542', desc: `Statistics` },
    {
      code: 'F058',
      desc: `Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics`,
    },
    {
      code: 'F0588',
      desc: `Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics`,
    },
    { code: 'F059', desc: `Natural sciences, mathematics and statistics not elsewhere classified` },
    { code: 'F0599', desc: `Natural sciences, mathematics and statistics not elsewhere classified` },
    { code: 'F06', desc: `Information and Communication Technologies` },
    { code: 'F061', desc: `Information and Communication Technologies` },
    { code: 'F0610', desc: `Information and Communication Technologies not further defined` },
    { code: 'F0611', desc: `Computer use` },
    {
      code: 'F0612_0613',
      desc: `Database and network design and administration, software and applications development and analysis`,
    },
    { code: 'F0612', desc: `Database and network design and administration` },
    { code: 'F0613', desc: `Software and applications development and analysis` },
    { code: 'F0619', desc: `Information and Communication Technologies not elsewhere classified` },
    {
      code: 'F068',
      desc: `Inter-disciplinary programmes and qualifications involving information and Communication Technologies`,
    },
    {
      code: 'F0688',
      desc: `Inter-disciplinary programmes and qualifications involving information and Communication Technologies`,
    },
    { code: 'F07', desc: `Engineering, manufacturing and construction` },
    { code: 'F070', desc: `Engineering, manufacturing and construction not further defined` },
    { code: 'F0700', desc: `Engineering, manufacturing and construction not further defined` },
    { code: 'F071', desc: `Engineering and engineering trades` },
    { code: 'F0710', desc: `Engineering and engineering trades not further defined` },
    { code: 'F0711', desc: `Chemical engineering and processes` },
    { code: 'F0712', desc: `Environmental protection technology` },
    { code: 'F0713', desc: `Electricity and energy` },
    { code: 'F0714', desc: `Electronics and automation` },
    { code: 'F0715', desc: `Mechanics and metal trades` },
    { code: 'F0716', desc: `Motor vehicles, ships and aircraft` },
    { code: 'F0719', desc: `Engineering and engineering trades not elsewhere classified` },
    { code: 'F072', desc: `Manufacturing and processing` },
    { code: 'F0720', desc: `Manufacturing and processing not further defined` },
    { code: 'F0721', desc: `Food processing` },
    { code: 'F0722', desc: `Materials (glass, paper, plastic and wood)` },
    { code: 'F0723', desc: `Textiles (clothes, footwear and leather)` },
    { code: 'F0724', desc: `Mining and extraction` },
    { code: 'F0729', desc: `Manufacturing and processing not elsewhere classified` },
    { code: 'F073', desc: `Architecture and construction` },
    { code: 'F0730', desc: `Architecture and construction not further defined` },
    { code: 'F0731', desc: `Architecture and town planning` },
    { code: 'F0732', desc: `Building and civil engineering` },
    {
      code: 'F078',
      desc: `Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction`,
    },
    {
      code: 'F0788',
      desc: `Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction`,
    },
    { code: 'F079', desc: `Engineering, manufacturing and construction not elsewhere classified` },
    { code: 'F0799', desc: `Engineering, manufacturing and construction not elsewhere classified` },
    { code: 'F08', desc: `Agriculture, forestry, fisheries and veterinary` },
    { code: 'F080', desc: `Agriculture, forestry, fisheries and veterinary not further defined` },
    { code: 'F0800', desc: `Agriculture, forestry, fisheries and veterinary not further defined` },
    { code: 'F081-083_088', desc: `	Agriculture, forestry and fishery` },
    { code: 'F081', desc: `Agriculture` },
    { code: 'F0810', desc: `Agriculture not further defined` },
    { code: 'F0811', desc: `Crop and livestock production` },
    { code: 'F0812', desc: `Horticulture` },
    { code: 'F0819', desc: `Agriculture not elsewhere classified` },
    { code: 'F082', desc: `Forestry` },
    { code: 'F0821', desc: `Forestry` },
    { code: 'F083', desc: `Fisheries` },
    { code: 'F0831', desc: `Fisheries` },
    { code: 'F084', desc: `Veterinary` },
    { code: 'F0841', desc: `Veterinary` },
    {
      code: 'F088',
      desc: `Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary`,
    },
    {
      code: 'F0888',
      desc: `Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary`,
    },
    { code: 'F089', desc: `Agriculture, forestry, fisheries and veterinary not elsewhere classified` },
    { code: 'F0899', desc: `Agriculture, forestry, fisheries and veterinary not elsewhere classified` },
    { code: 'F09', desc: `Health and welfare` },
    { code: 'F090', desc: `Health and welfare not further defined` },
    { code: 'F0900', desc: `Health and welfare not further defined` },
    { code: 'F091', desc: `Health` },
    { code: 'F0910', desc: `Health not further defined` },
    { code: 'F0911', desc: `Dental studies` },
    { code: 'F0912_0915_0917', desc: `Medicine, therapy and rehabilitation` },
    { code: 'F0912', desc: `Medicine` },
    { code: 'F0913_0921', desc: `Nursing, midwifery and care of the elderly and of disabled adults` },
    { code: 'F0913', desc: `Nursing and midwifery` },
    { code: 'F0914', desc: `Medical diagnostic and treatment technology` },
    { code: 'F0915', desc: `Therapy and rehabilitation` },
    { code: 'F0916', desc: `Pharmacy` },
    { code: 'F0917', desc: `Traditional and complementary medicine and therapy` },
    { code: 'F0919', desc: `Health not elsewhere classified` },
    { code: 'F092', desc: `Welfare` },
    { code: 'F0920', desc: `Welfare not further defined` },
    { code: 'F0921', desc: `Care of the elderly and of disabled adults` },
    { code: 'F0922', desc: `Child care and youth services` },
    { code: 'F0923', desc: `Social work and counselling` },
    { code: 'F0929', desc: `Welfare not elsewhere classified` },
    { code: 'F098', desc: `Inter-disciplinary programmes and qualifications involving health and welfare` },
    { code: 'F0988', desc: `Inter-disciplinary programmes and qualifications involving health and welfare` },
    { code: 'F099', desc: `Health and welfare not elsewhere classified` },
    { code: 'F0999', desc: `Health and welfare not elsewhere classified` },
    { code: 'F10', desc: `Services` },
    { code: 'F100', desc: `Services not further defined` },
    { code: 'F1000', desc: `Services not further defined` },
    { code: 'F101', desc: `Personal services` },
    { code: 'F1010', desc: `Personal services not further defined` },
    { code: 'F1011', desc: `Domestic services` },
    { code: 'F1012', desc: `Hair and beauty services` },
    { code: 'F1013', desc: `Hotel, restaurants and catering` },
    { code: 'F1014', desc: `Sports` },
    { code: 'F1015', desc: `Travel, tourism and leisure` },
    { code: 'F1019', desc: `Personal services not elsewhere classified` },
    { code: 'F102', desc: `Hygiene and occupational health services` },
    { code: 'F1020', desc: `Hygiene and occupational health services not further defined` },
    { code: 'F1021', desc: `Community sanitation` },
    { code: 'F1022', desc: `Occupational health and safety` },
    { code: 'F1029', desc: `Hygiene and occupational health services not elsewhere classified` },
    { code: 'F103', desc: `Security services` },
    { code: 'F1030', desc: `Security services not further defined` },
    { code: 'F1031', desc: `Military and defence` },
    { code: 'F1032', desc: `Protection of persons and property` },
    { code: 'F1039', desc: `Security services not elsewhere classified` },
    { code: 'F104', desc: `Transport services` },
    { code: 'F1041', desc: `Transport services` },
    { code: 'F108', desc: `Inter-disciplinary programmes and qualifications involving services` },
    { code: 'F1088', desc: `Inter-disciplinary programmes and qualifications involving services` },
    { code: 'F109', desc: `Services not elsewhere classified` },
    { code: 'F1099', desc: `Services not elsewhere classified` },
  ]
}
