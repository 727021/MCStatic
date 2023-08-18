export default {
    '*.ts': ({ filenames }) => [
        `eslint --fix ${filenames.join(' ')}`,
        `prettier --write ${filenames.join(' ')}`,
        'npm run build'
    ]
}
