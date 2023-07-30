import { firestoreFetchDoc, COLLECTIONS, DOCS, type SpeciesInfo } from '../../lib/firebase';
import { saveToFile } from '../../lib';

// const defaultFilename = `species-backup-${new Date().toLocaleDateString()}.csv`;

export default async function exportDatabase(suggestedName: string) {
  const { species } = await firestoreFetchDoc<{ species: SpeciesInfo[] }>(COLLECTIONS.APPLICATION, DOCS.BUNDLES);

  const csvContent = [];
  for (const { kingdom, order, family, species: s, sex, speciesLatin, place, county, date, image } of species) {
    csvContent.push(`${kingdom};${order};${family};${s};${sex};${speciesLatin};${place};${county};${date};${image}`);
  }

  // If we prepend \ufeff to the content the file will be saved as UTF-8 with BOM rather than UTF-8.
  const content = '\ufeff' + csvContent.join('\n');
  const file = new Blob([content], { type: 'text/csv;charset=utf-8,' });

  try {
    const filename = await saveToFile(file, suggestedName, [
      {
        description: 'CSV files',
        accept: {
          'application/csv': ['.csv'],
        },
      },
    ]);

    return filename;
  } catch (error) {
    if (error === 'ABORTED') return;
    console.error(error);
  }
}
