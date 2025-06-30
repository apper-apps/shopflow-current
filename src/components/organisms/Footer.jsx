import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Electronics', href: '/category/electronics' },
        { name: 'Clothing', href: '/category/clothing' },
        { name: 'Home & Garden', href: '/category/home-garden' },
        { name: 'Sports', href: '/category/sports' },
        { name: 'Books', href: '/category/books' },
        { name: 'Beauty', href: '/category/beauty' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Track Order', href: '/track' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Investor Relations', href: '/investors' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'Youtube', icon: 'Youtube', href: '#' }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Stay in the loop
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Get the latest deals, new product announcements, and exclusive offers delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button className="bg-secondary-700 hover:bg-secondary-800 text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-gray-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-primary-600 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                <ApperIcon name="ShoppingBag" size={20} className="text-white" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-700 bg-clip-text text-transparent">
                ShopFlow
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                    aria-label={social.name}
                  >
                    <ApperIcon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <ApperIcon name="Shield" size={16} />
                <span>Secure Shopping</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>&copy; 2024 ShopFlow. All rights reserved. Built with ❤️ for shoppers worldwide.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer