import { Select, HelpIcon } from "@yoast/components";
import { createPortal, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import styled from "styled-components";
import SidebarCollapsible from "./SidebarCollapsible";

const SchemaContainer = styled.div`
	padding: 16px;
`;

/**
 * Function that uses a postTypeName to create a string which will be used to create a link to the Search Appearance settings.
 *
 * @param {string} postTypeName The name of the current post type.
 *
 * @returns {string} A string that contains tags that will be interpolated.
 */
const footerText = ( postTypeName ) => sprintf(
	/* translators: %1$s expands to the plural name of the current post type, %2$s and %3$s expand to a link to the Search Appearance Settings page */
	__( "You can change the default type for %1$s in your %2$sSearch Appearance Settings%3$s.", "wordpress-seo" ),
	postTypeName,
	"{{link}}",
	"{{/link}}",
);

/**
 * Interpolates the footerText string with an actual link component.
 *
 * @param {string} postTypeName  The name of the current post type.
 *
 * @returns {string} A link to the Search Appearance settings.
 */
const footerWithLink = ( postTypeName ) => interpolateComponents(
	{
		mixedString: footerText( postTypeName ),
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		components: { link: <a href="/wp-admin/admin.php?page=wpseo_titles#top#post-types" /> },
	},
);

/**
 * Returns the content of the schema tab.
 *
 * @param {object} props Component props.
 *
 * @returns {React.Component} The schema tab content.
 */
const Content = ( props ) => (
	<Fragment>
		<div className="yoast-field-group__title">
			<b>{ props.helpTextTitle }</b>
			<HelpIcon
				linkTo={ props.helpTextLink }
				linkText={ __( "Learn more about structured data with Schema.org", "wordpress-seo" ) }
			/>
		</div>
		<p>
			{ props.helpTextDescription }
		</p>
		<div className="yoast-field-group__title" style={ { paddingTop: 16, paddingBottom: 16 } }>
			<b>{ __( "What type of page or content is this?", "wordpress-seo" ) }</b>
			<HelpIcon
				linkTo={ props.additionalHelpTextLink }
				linkText={ __( "Learn more about page or content types", "wordpress-seo" ) }
			/>
		</div>
		<Select
			id="yoast_wpseo_schema_page_type_react"
			name={ null }
			options={ props.schemaPageTypeOptions }
			label={ __( "Page type", "wordpress-seo" ) }
			onChange={ props.schemaPageTypeChange }
			selected={ props.schemaPageTypeSelected }
		/>
		{ props.showArticleTypeInput && <Select
			id="yoast_wpseo_schema_article_type_react"
			name={ null }
			options={ props.schemaArticleTypeOptions }
			label={ __( "Article type", "wordpress-seo" ) }
			onChange={ props.schemaArticleTypeChange }
			selected={ props.schemaArticleTypeSelected }
		/> }
		<p>{ footerWithLink( props.postTypeName ) }</p>
	</Fragment>
);

Content.propTypes = {
	schemaPageTypeChange: PropTypes.func,
	schemaPageTypeSelected: PropTypes.string,
	schemaArticleTypeChange: PropTypes.func,
	schemaArticleTypeSelected: PropTypes.string,
	showArticleTypeInput: PropTypes.bool.isRequired,
	additionalHelpTextLink: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
};

Content.defaultProps = {
	schemaPageTypeChange: () => {},
	schemaPageTypeSelected: null,
	schemaArticleTypeChange: () => {},
	schemaArticleTypeSelected: null,
};

/**
 * Renders the schema tab.
 *
 * @param {object} props The component props.
 *
 * @returns {React.Component} The schema tab.
 */
const SchemaTab = ( props ) => {
	if ( props.isMetabox ) {
		return createPortal(
			<SchemaContainer>
				<Content { ...props } />
			</SchemaContainer>,
			document.getElementById( "wpseo-meta-section-schema" )
		);
	}

	return (
		<SidebarCollapsible
			title={ __( "Schema", "wordpress-seo" ) }
		>
			<Content { ...props } />
		</SidebarCollapsible>
	);
};

SchemaTab.propTypes = {
	showArticleTypeInput: PropTypes.bool,
	articleTypeLabel: PropTypes.string,
	additionalHelpTextLink: PropTypes.string,
	pageTypeLabel: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
	isMetabox: PropTypes.bool.isRequired,
	postTypeName: PropTypes.string.isRequired,
};

SchemaTab.defaultProps = {
	showArticleTypeInput: false,
	articleTypeLabel: "",
	additionalHelpTextLink: "",
};

export default SchemaTab;
