import Page from './Page';

export default function About() {
  return (
    <Page title="About">
      <h5>Version 0.0.11 (2023-09-19)</h5>
      <ul>
        <li>Bildblock sorteras på det latinska artnamnet i stigande ordning.</li>
        <li>Fältet län har ändrats till landskap.</li>
      </ul>
      <h5>Version 0.0.10 (2023-09-19)</h5>
      <ul>
        <li>Ikoner som visar artens kön har lagts till i samlingar.</li>
      </ul>
      <h5>Version 0.0.8 (2023-07-31)</h5>
      <ul>
        <li>Denna sida har lagts till.</li>
      </ul>
    </Page>
  );
}
