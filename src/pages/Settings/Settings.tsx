import classes from './Settings.module.css';
import Page from '../Page';
import ImportImages from './ImportImages';
import ImportSpeciesBundle from './ImportSpeciesBundle';
import ExportDatabase from './ExportDatabase';
import CreateImageBundle from './CreateImageBundle';
import MergeChangesIntoBundle from './MergeChangesIntoBundle'

export default function Settings() {
  return (
    <Page title="Inställningar">
      <h2>Actions</h2>
      <div className={classes.actionGrid}>
        <div className={classes.cell}>
          <ImportImages />
        </div>
        <div className={classes.cell}>
          <CreateImageBundle />
        </div>
        <div className={classes.cell}>
          <ImportSpeciesBundle />
        </div>
        <div className={classes.cell}>
          <ExportDatabase />
        </div>
        <div className={classes.cell}>
          <MergeChangesIntoBundle />
        </div>
      </div>
    </Page>
  );
}
