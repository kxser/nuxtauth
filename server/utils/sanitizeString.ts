/**
 * Options for string sanitization
 */
export interface SanitizeOptions {
    /** Maximum allowed string length (default: 1000) */
    maxLength?: number;
    
    /** Remove HTML tags (default: true) */
    stripHtml?: boolean;
    
    /** Encode HTML special chars like &, <, >, ", ' (default: true) */
    encodeHtmlChars?: boolean;
    
    /** Normalize whitespace - trim and collapse multiple spaces (default: true) */
    normalizeWhitespace?: boolean;
    
    /** Remove potentially dangerous SQL patterns (default: true) */
    preventSqlInjection?: boolean;
    
    /** Remove control characters and non-printable chars (default: true) */
    stripControlChars?: boolean;
    
    /** Allow only alphanumeric chars and common punctuation (default: false) */
    strictMode?: boolean;
  }
  

  export function sanitizeString(input: unknown, options?: SanitizeOptions): string {
    // Handle null, undefined, or non-string inputs
    if (input === null || input === undefined) {
      return '';
    }
    let result = String(input);
    
    // Default options
    const opts: SanitizeOptions = {
      maxLength: 1024,
      stripHtml: false,
      encodeHtmlChars: false,
      normalizeWhitespace: true,
      preventSqlInjection: false,
      stripControlChars: false,
      strictMode: false,
      ...options
    };
    
    // Strip HTML tags
    if (opts.stripHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }
    
    // Encode HTML special characters
    if (opts.encodeHtmlChars) {
      result = result
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    
    // Remove control characters (0x00-0x1F and 0x7F-0x9F except whitespace)
    if (opts.stripControlChars) {
      result = result.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    }
    
    // Normalize whitespace
    if (opts.normalizeWhitespace) {
      // Replace tabs, newlines, etc. with spaces
      result = result.replace(/\s+/g, ' ').trim();
    }
    
    // Remove SQL injection patterns
    if (opts.preventSqlInjection) {
      // Replace common SQL injection patterns
      result = result
        .replace(/\/\*.*?\*\//g, '') // Remove comments
        .replace(/;/g, '') // Remove semicolons
        .replace(/--/g, '') // Remove double dashes
        .replace(/exec\s+/gi, '') // Block exec
        .replace(/union\s+select/gi, '') // Block UNION SELECT
        .replace(/insert\s+into/gi, '') // Block INSERT INTO
        .replace(/drop\s+table/gi, '') // Block DROP TABLE
        .replace(/alter\s+table/gi, '') // Block ALTER TABLE
        .replace(/delete\s+from/gi, ''); // Block DELETE FROM
    }
    
    // Strict mode - only allow alphanumeric and basic punctuation
    if (opts.strictMode) {
      result = result.replace(/[^a-zA-Z0-9_\-.,!?@#$%^&*()[\]{}<>:;'" ]/g, '');
    }
    
    // Apply length limit
    if (opts.maxLength && result.length > opts.maxLength) {
      result = result.substring(0, opts.maxLength);
    }
    
    return result;
  }
  
