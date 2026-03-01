import chalk from 'chalk';

const DEFAULT_TERMINAL_WIDTH = 80;

// Symbols for consistent visual feedback
const symbols = {
  success: chalk.green('✓'),
  error: chalk.red('✖'),
  warning: chalk.yellow('⚠'),
  info: chalk.blue('ℹ'),
  arrow: chalk.cyan('→'),
  bullet: chalk.dim('•'),
};

// Create a responsive divider that adapts to terminal width
function divider(color = 'cyan') {
  const width = Math.min(process.stdout.columns || DEFAULT_TERMINAL_WIDTH, DEFAULT_TERMINAL_WIDTH);
  return chalk[color]('─'.repeat(width));
}

function pluralize(count, word) {
  return count === 1 ? word : `${word}s`;
}

// Success message with optional file path
export function success(message, filePath) {
  if (filePath) {
    console.log(`  ${symbols.success} ${chalk.green(message)}`);
    console.log(`    ${symbols.arrow} ${chalk.dim(filePath)}`);
  } else {
    console.log(`${symbols.success} ${chalk.green(message)}`);
  }
}

// Error message with optional details and suggestions
export function error(message, { details, suggestions } = {}) {
  console.log();
  console.log(`${symbols.error} ${chalk.red.bold('ERROR:')} ${chalk.red(message)}`);

  if (details) {
    console.log(`  ${chalk.dim(details)}`);
  }

  if (suggestions && suggestions.length > 0) {
    console.log();
    console.log(chalk.dim('  Try one of:'));
    suggestions.forEach((suggestion) => {
      console.log(`    ${symbols.bullet} ${chalk.dim(suggestion)}`);
    });
  }
  console.log();
}

// Error message with exit
export function exitWithError(message, options = {}, exitCode = 1) {
  error(message, options);
  process.exit(exitCode);
}

// Warning message
export function warning(message) {
  console.log(`${symbols.warning} ${chalk.yellow(message)}`);
}

// Info message
export function info(message) {
  console.log(`${symbols.info} ${chalk.cyan(message)}`);
}

// Header for sections (like config setup intro)
export function header(title, subtitle) {
  console.log();
  console.log(divider());
  console.log(chalk.cyan.bold(title));
  if (subtitle) {
    console.log(chalk.dim(subtitle));
  }
  console.log(divider());
  console.log();
}

// Summary after file generation
export function fileSummary(files, basePath, { dryRun = false } = {}) {
  console.log();

  const createdFiles = files.filter(f => f.status === 'created');
  const skippedFiles = files.filter(f => f.status === 'skipped');

  if (dryRun) {
    // Dry-run mode: show what would happen
    console.log(`${symbols.info} ${chalk.cyan('Dry-run mode')} ${chalk.dim('- no files were created')}`);
    console.log();

    if (createdFiles.length > 0) {
      console.log(chalk.dim(`Would create in ${basePath}:`));
      createdFiles.forEach((file, index) => {
        const isLast = index === createdFiles.length - 1 && skippedFiles.length === 0;
        const prefix = isLast ? '└──' : '├──';
        console.log(`  ${chalk.dim(prefix)} ${file.filename}`);
      });
    }

    if (skippedFiles.length > 0) {
      if (createdFiles.length > 0) {
        console.log();
      }
      console.log(chalk.dim('Already exist (would be skipped):'));
      skippedFiles.forEach((file, index) => {
        const isLast = index === skippedFiles.length - 1;
        const prefix = isLast ? '└──' : '├──';
        console.log(`  ${chalk.dim(prefix)} ${symbols.warning} ${chalk.dim(file.filename)}`);
      });
    }
  } else {
    // Actual run: show what happened
    if (createdFiles.length > 0) {
      console.log(`${symbols.success} ${chalk.green(`Created ${createdFiles.length} ${pluralize(createdFiles.length, 'file')} in ${basePath}`)}`);
    }
    if (skippedFiles.length > 0) {
      console.log(`${symbols.warning} ${chalk.yellow(`Skipped ${skippedFiles.length} ${pluralize(skippedFiles.length, 'file')} (already exist)`)}`);
    }

    // Show file tree with status icons
    files.forEach((file, index) => {
      const isLast = index === files.length - 1;
      const prefix = isLast ? '└──' : '├──';
      const statusIcon = file.status === 'created'
        ? symbols.success
        : file.status === 'skipped'
          ? symbols.warning
          : symbols.error;
      console.log(`  ${chalk.dim(prefix)} ${statusIcon} ${file.filename}`);
    });
  }

  console.log();
}

// Closing message (Happy Hacking)
export function outro(message = 'Happy Hacking!') {
  console.log(chalk.cyan(message));
  console.log();
}

// Blank line helper
export function blank() {
  console.log();
}
