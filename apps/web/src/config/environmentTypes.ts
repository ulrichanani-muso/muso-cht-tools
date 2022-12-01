// enum EnvironmentName {
//   prod,
//   test,
//   local,
// }

interface EnvironmentType {
  code: string;
  name: string;
  colorVariant: string;
}

const environmentTypes: EnvironmentType[] = [
  {
    code: 'production',
    name: 'Production',
    colorVariant: 'danger',
  },
  {
    code: 'test',
    name: 'Test',
    colorVariant: 'warning',
  },
  {
    code: 'development',
    name: 'Developement',
    colorVariant: 'secondary',
  },
  {
    code: 'local',
    name: 'Local',
    colorVariant: 'info',
  },
]

export default environmentTypes
