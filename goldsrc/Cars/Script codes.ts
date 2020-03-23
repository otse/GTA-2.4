
export const parkedCarNames: string[] = [
	"Romero", "Wellard", "Aniston BD4", /*"Pacifier",
	"G4 Bank Van",*/ "Beamer", /*"Box Car", "Box Truck",*/
	"Bug", "Bulwark", /*"Bus",*/ "Cop Car",
	"Minx", "Eddy", "Panto", /*"Fire Truck",*/
	"Shark", "GT-A1", /*"Garbage Truck", "Armed Land Roamer",*/
	/*"Hot Dog Van", "Ice-Cream Van", "Dementia Limousine",*/ "Dementia",
	"Land Roamer", "Jefferson", /*"Stretch Limousine", "Sports Limousine",*/
	/*"Medicar",*/ "Benson", "Schmidt", "Miara",
	"Big Bug", "Morton", "Maurice", "Pickup",
	"A-Type", "Arachnid", "Spritzer", "Stinger",
	"Meteor", /*"Meteor Twoo?",*/ "Hachura", "B-Type",
	"Taxi Xpress", /*"SWAT Van",*/ "Michelli Roadster", /*"Tank",
	"Tanker",*/ "Taxi", "T-Rex", /*"Tow Truck",*/
	/*"Train", "Train Cab", "Train FB",*/ "Trance-Am",
	/*"Truck Cab", "Truck Cab SX", "Container", "Transporter",*/
	"TV Van", "Van", "U-Jerk Truck", "Z-Type",
	"Rumbler", /*"Wreck 0", "Wreck 1", "Wreck 2",
	"Wreck 3", "Wreck 4", "Wreck 5", "Wreck 6",
	"Wreck 7", "Wreck 8", "Wreck 9",*/ "Jagular XK",
	"Furore GT", "Special Agent Car"/*, "Karma Bus",*/
];

export const carScriptCodes =
{
	'Arachnid': 'SPIDER',
	'Armed Land Roamer': 'GUNJEEP',
	'A-Type': 'RTYPE',
	'Beamer': 'BMW',
	'Benson': 'MERC',
	'Box Truck': 'BOXTRUCK',
	'Big Bug': 'MONSTER',
	'B-Type': 'STYPE',
	'Bug': 'BUG',
	'Bus': 'BUS',
	'Bulwark': 'BUICK',
	'Container': 'TRUKCONT',
	'Cop Car': 'COPCAR',
	'Dementia': 'ISETTA',
	'Dementia Limousine': 'ISETLIMO',
	'Eddy': 'EDSEL',
	'Fire Truck': 'FIRETRUK',
	'Furore GT': 'ZCX5',
	'G4 Bank Van': 'BANKVAN',
	'Garbage Truck': 'GTRUCK',
	'GT-A1': 'GT24640',
	'Hachura': 'STRIPETB',
	'Hot Dog Van': 'HOTDOG',
	'Ice-Cream Van': 'ICECREAM',
	'Jagular XK': 'XK120',
	'Jefferson': 'JEFFREY',
	'Karma Bus': 'KRSNABUS',
	'Land Roamer': 'JEEP',
	'Maurice': 'MORRIS',
	'Medicar': 'MEDICAR',
	'Meteor': 'STRATOS',
	'Meteor Twoo?': 'STRATOSB',
	'Miara': 'MIURA',
	'Michelli Roadster': 'T2000GT',
	'Minx': 'DART',
	'Morton': 'MORGAN',
	'Pacifier': 'APC',
	'Panto': 'FIAT',
	'Pickup': 'PICKUP',
	'Romero': 'ALFA',
	'Rumbler': 'WBTWIN',
	'Schmidt': 'MESSER',
	'Shark': 'GRAHAM',
	'Special Agent Car': 'EDSELFBI',
	'Sports Limousine': 'LIMO2',
	'Spritzer': 'SPRITE',
	'Stinger': 'STINGRAY',
	'Stretch Limousine': 'LIMO',
	'SWAT Van': 'SWATVAN',
	'Tank': 'TANK',
	'Tanker': 'TANKER',
	'Taxi': 'TAXI',
	'Taxi Xpress': 'STYPECAB',
	'Tow Truck': 'TOWTRUCK',
	'Trance-Am': 'TRANCEAM',
	'Transporter': 'TRUKTRNS',
	'T-Rex': 'TBIRD',
	'Truck Cab': 'TRUKCAB1',
	'Truck Cab SX': 'TRUKCAB2',
	'TV Van': 'TVVAN',
	'U-Jerk Truck': 'VESPA',
	'Van': 'VAN',
	'Wellard': 'ALLARD',
	'Z-Type': 'VTYPE'
};

// Todo, gta22 never used this
export interface NotUsedYet {
	too_high_for_a_ped_to_jump?: boolean;
	emergency_lights?: boolean;
	roof_lights?: boolean;
	cab?: boolean;
	trailer?: boolean;
	forhire_lights?: boolean;
	roof_decal?: boolean;
	rear_emergency_lights?: boolean;
	can_drive_over_other_cars?: boolean;
	has_popup_headlights?: boolean;
	bulletproof?: boolean;
	info_flags_x?: boolean;
}
