import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => (
  <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-800" {...props}>
    {children}
  </div>
)

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <header className="px-4 py-3 border-b border-gray-200 dark:border-gray-700" {...props}>
    {children}
  </header>
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white" {...props}>
    {children}
  </h2>
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => (
  <p className="text-sm text-gray-600 dark:text-gray-400" {...props}>
    {children}
  </p>
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div className="p-4" {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700" {...props}>
    {children}
  </footer>
)

export type { CardProps }

